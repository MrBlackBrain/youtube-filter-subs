// Load all modules dynamically
Promise.all([
	import(chrome.runtime.getURL("src/scripts/lib/state.js")),
	import(chrome.runtime.getURL("src/scripts/lib/config.js")),
	import(chrome.runtime.getURL("src/scripts/lib/utils.js")),
	import(chrome.runtime.getURL("src/scripts/lib/query-handling.js")),
	import(chrome.runtime.getURL("src/scripts/lib/visibility-management.js")),
	import(chrome.runtime.getURL("src/scripts/lib/ui-creation.js")),
	import(chrome.runtime.getURL("src/scripts/lib/mode-management.js")),
	import(chrome.runtime.getURL("src/scripts/lib/status-classification.js")),
	import(chrome.runtime.getURL("src/scripts/common.js")),
])
	.then(
		([
			stateModule,
			configModule,
			utilsModule,
			queryModule,
			visibilityModule,
			uiModule,
			modeModule,
			statusModule,
			common,
		]) => {
			const lang = document.documentElement.getAttribute("lang");
			import(chrome.runtime.getURL("src/lang/" + (lang ? lang : "en") + ".js"))
				.then((lang) => {
					// Extract all the imports
					const { filterState } = stateModule;
					const { buttonLabels, selectors } = configModule;
					const {
						display,
						displayAny,
						displayQuery,
						isMenuTarget,
						isPositionFixedTarget,
						forTwoColumnBrowseResultsRenderer,
						forPageHeaderRenderer,
						needSpacer,
						searchParentNode,
						getPopupKey,
					} = utilsModule;
					const { updateQueryRegex, updatePopupQueryRegex, matchQuery, matchPopupQuery } = queryModule;
					const { updateVisibility, updateTargetVisibility, updatePopupVisibility, handleContinuationItem } =
						visibilityModule;
					const {
						createSpacer,
						createButton,
						createButtonChannels,
						createSelect,
						createOption,
						createSelectProgress,
						createOptionProgress,
						createQueryInput,
						createQueryInputArea,
						createSearchButton,
						createLoadButtonContainer,
						createSpinner,
						createNodeForCalc,
					} = uiModule;
					const { changeMode, changeModeProgress } = modeModule;
					const { includesStatus } = statusModule;

					main(document.querySelector("ytd-app") ?? document.body, common, lang, {
						filterState,
						buttonLabels,
						selectors,
						display,
						displayAny,
						displayQuery,
						isMenuTarget,
						isPositionFixedTarget,
						forTwoColumnBrowseResultsRenderer,
						forPageHeaderRenderer,
						needSpacer,
						searchParentNode,
						getPopupKey,
						updateQueryRegex,
						updatePopupQueryRegex,
						matchQuery,
						matchPopupQuery,
						updateVisibility,
						updateTargetVisibility,
						updatePopupVisibility,
						handleContinuationItem,
						createSpacer,
						createButton,
						createButtonChannels,
						createSelect,
						createOption,
						createSelectProgress,
						createOptionProgress,
						createQueryInput,
						createQueryInputArea,
						createSearchButton,
						createLoadButtonContainer,
						createSpinner,
						createNodeForCalc,
						changeMode,
						changeModeProgress,
						includesStatus,
					});
				})
				.catch((error) => {
					console.error("Failed to load language module:", error);
				});
		}
	)
	.catch((error) => {
		console.error("Failed to load extension modules:", error);
	});

function main(app, common, lang, modules) {
	// Extract modules for easier access
	const {
		filterState,
		selectors,
		display,
		displayAny,
		displayQuery,
		isMenuTarget,
		isPositionFixedTarget,
		forTwoColumnBrowseResultsRenderer,
		forPageHeaderRenderer,
		needSpacer,
		searchParentNode,
		getPopupKey,
		updateQueryRegex,
		matchQuery,
		matchPopupQuery,
		updateVisibility,
		updateTargetVisibility,
		updatePopupVisibility,
		handleContinuationItem,
		createSpacer,
		createButton,
		createSelect,
		createOption,
		createQueryInput,
		createQueryInputArea,
		createSearchButton,
		createLoadButtonContainer,

		createNodeForCalc,
		changeMode,
		changeModeProgress,
		includesStatus,
	} = modules;
	// Initialize shared UI elements
	const load_button_container = createLoadButtonContainer(common, filterState);

	async function updateButtonVisibility(browse) {
		await chrome.storage.local.get(common.storage).then((data) => {
			// Update filterState with storage data
			filterState.updateSettings(data, common);

			// Update button visibility for different page types
			updateButtonVisibilityForPageType(browse, data, common);

			onResize();
			changeMode(
				filterState.getActiveMode().values().next().value,
				filterState.settings.multiselection,
				false,
				browse,
				filterState,
				common
			);
			changeModeProgress(
				filterState.getActiveModeProgress().values().next().value,
				filterState.settings.multiselection,
				false,
				browse,
				filterState,
				common
			);
			updateQueryRegex(browse, filterState.getActiveQuery(browse), filterState);
			updateVisibility(browse, filterState, lang, selectors, includesStatus, matchQuery);

			// Update popup menu visibility
			updatePopupMenuVisibility(app);
		});
	}

	function updateButtonVisibilityForPageType(browse, data, common) {
		for (const menu of browse.querySelectorAll("form.filter-menu")) {
			updateMenuButtons(menu, data, common);
		}

		const buttonVisibilitySettings = getButtonVisibilitySettings(data, common);
		setButtonVisibilityByPageType(browse, buttonVisibilitySettings, common);
	}

	function updateMenuButtons(menu, data, common) {
		const select = menu.querySelector("select.filter-menu");

		// Re-append elements in correct order (only if they exist)
		const allSubsButton = menu.querySelector("span.filter-button-subscriptions.all");
		if (allSubsButton) menu.appendChild(allSubsButton);

		const allChannelsButton = menu.querySelector("span.filter-button-channels.all");
		if (allChannelsButton) menu.appendChild(allChannelsButton);

		if (select) {
			const allSubsOption = select.querySelector("option.filter-button-subscriptions.all");
			if (allSubsOption) select.appendChild(allSubsOption);
		}

		// Update button labels and order
		for (const mode of common.order(data.order)) {
			if (
				[
					"keyword",
					"multiselection",
					"responsive",
					"keyword_add_playlist",
					"keyword_sidebar_channels",
					"keyword_notification",
				].includes(mode)
			) {
				continue;
			}

			updateButtonForMode(menu, mode, data, common, select);
		}

		if (select) menu.appendChild(select);

		for (const query of menu.querySelectorAll("span.filter-query")) {
			if (query) menu.appendChild(query);
		}
	}

	function updateButtonForMode(menu, mode, data, common, select) {
		const button_text = data["button_label_" + mode] || common.button_label[mode];

		if (mode.startsWith("progress_")) {
			const span = menu.querySelector("span.filter-button." + mode);
			if (span) {
				span.innerHTML = button_text;
				menu.appendChild(span);
			}
		} else if (mode.startsWith("channels_")) {
			const span = menu.querySelector("span.filter-button." + mode);
			if (span) {
				span.innerHTML = button_text;
				menu.appendChild(span);
			}
		} else {
			const span = menu.querySelector("span.filter-button." + mode);
			if (span) {
				span.innerHTML = button_text;
				menu.appendChild(span);
			}

			if (select) {
				const option = select.querySelector("option.filter-button." + mode);
				if (option) {
					option.innerHTML = button_text;
					select.appendChild(option);
				}
			}
		}
	}

	function getButtonVisibilitySettings(data, common) {
		return {
			live: common.value(data.live, common.default_live),
			streamed: common.value(data.streamed, common.default_streamed),
			video: common.value(data.video, common.default_video),
			short: common.value(data.short, common.default_short),
			scheduled: common.value(data.scheduled, common.default_scheduled),
			notification_on: common.value(data.notification_on, common.default_notification_on),
			notification_off: common.value(data.notification_off, common.default_notification_off),
			progress_unwatched: common.value(data.progress_unwatched, common.default_progress_unwatched),
			progress_watched: common.value(data.progress_watched, common.default_progress_watched),
			channels_all: common.value(data.channels_all, common.default_channels_all),
			channels_personalized: common.value(data.channels_personalized, common.default_channels_personalized),
			channels_none: common.value(data.channels_none, common.default_channels_none),
		};
	}

	function setButtonVisibilityByPageType(browse, settings, common) {
		if (common.isSubscriptions(location.href)) {
			setSubscriptionsVisibility(browse, settings);
		} else if (common.isLibrary(location.href)) {
			setLibraryVisibility(browse, settings);
		} else if (common.isPlaylist(location.href)) {
			setPlaylistVisibility(browse, settings);
		} else if (common.isHistory(location.href)) {
			setHistoryVisibility(browse, settings);
		} else if (common.isHashTag(location.href)) {
			setHashTagVisibility(browse, settings);
		} else if (common.isPlaylists(location.href)) {
			setPlaylistsVisibility(browse);
		} else if (common.isChannel(location.href)) {
			setChannelVisibility(browse, settings);
		} else if (common.isShorts(location.href)) {
			setShortsVisibility(browse);
		} else if (common.isChannels(location.href)) {
			setChannelsVisibility(browse, settings);
		} else if (common.isTop(location.href)) {
			setTopVisibility(browse, settings);
		}
	}

	function setSubscriptionsVisibility(browse, settings) {
		const {
			live,
			streamed,
			video,
			short,
			scheduled,
			notification_on,
			notification_off,
			progress_unwatched,
			progress_watched,
		} = settings;

		displayQuery(
			browse,
			"span.filter-button-subscriptions.all",
			displayAny([live, streamed, video, short, scheduled, notification_on, notification_off])
		);
		displayQuery(browse, "span.filter-button-subscriptions.live", display(live));
		displayQuery(browse, "span.filter-button-subscriptions.streamed", display(streamed));
		displayQuery(browse, "span.filter-button-subscriptions.video", display(video));
		displayQuery(browse, "span.filter-button-subscriptions.short", display(short));
		displayQuery(browse, "span.filter-button-subscriptions.scheduled", display(scheduled));
		displayQuery(browse, "span.filter-button-subscriptions.notification_on", display(notification_on));
		displayQuery(browse, "span.filter-button-subscriptions.notification_off", display(notification_off));

		displayQuery(
			browse,
			"select.filter-menu",
			displayAny([live, streamed, video, short, scheduled, notification_on, notification_off])
		);
		displayQuery(
			browse,
			"option.filter-button-subscriptions.all",
			displayAny([live, streamed, video, short, scheduled, notification_on, notification_off])
		);
		displayQuery(browse, "option.filter-button-subscriptions.live", display(live));
		displayQuery(browse, "option.filter-button-subscriptions.streamed", display(streamed));
		displayQuery(browse, "option.filter-button-subscriptions.video", display(video));
		displayQuery(browse, "option.filter-button-subscriptions.short", display(short));
		displayQuery(browse, "option.filter-button-subscriptions.scheduled", display(scheduled));
		displayQuery(browse, "option.filter-button-subscriptions.notification_on", display(notification_on));
		displayQuery(browse, "option.filter-button-subscriptions.notification_off", display(notification_off));

		displayQuery(browse, "span.filter-button.progress_unwatched", display(progress_unwatched));
		displayQuery(browse, "span.filter-button.progress_watched", display(progress_watched));

		displayQuery(browse, "span.filter-button-channels.all", "none");
		displayQuery(browse, "span.filter-button-channels.channels_all", "none");
		displayQuery(browse, "span.filter-button-channels.channels_personalized", "none");
		displayQuery(browse, "span.filter-button-channels.channels_none", "none");

		displayQuery(browse, "span.filter-query", display(filterState.settings.keyword));
	}

	function setLibraryVisibility(browse, settings) {
		const { live, streamed, video, short, scheduled } = settings;
		displayQuery(browse, "span.filter-button-subscriptions.all", displayAny([live, streamed, video, short, scheduled]));
		displayQuery(browse, "span.filter-button-subscriptions.live", display(live));
		displayQuery(browse, "span.filter-button-subscriptions.streamed", display(streamed));
		displayQuery(browse, "span.filter-button-subscriptions.video", display(video));
		displayQuery(browse, "span.filter-button-subscriptions.short", display(short));
		displayQuery(browse, "span.filter-button-subscriptions.scheduled", display(scheduled));
		displayQuery(browse, "span.filter-query", display(filterState.settings.keyword));
	}

	function setPlaylistVisibility(browse) {
		displayQuery(browse, "span.filter-button-subscriptions.all", "none");
		displayQuery(browse, "span.filter-query", display(filterState.settings.keyword));
	}

	function setHistoryVisibility(browse, settings) {
		const { live, streamed, video, short, scheduled } = settings;
		displayQuery(browse, "span.filter-button-subscriptions.all", displayAny([live, streamed, video, short, scheduled]));
		displayQuery(browse, "span.filter-button-subscriptions.live", display(live));
		displayQuery(browse, "span.filter-button-subscriptions.streamed", display(streamed));
		displayQuery(browse, "span.filter-button-subscriptions.video", display(video));
		displayQuery(browse, "span.filter-button-subscriptions.short", display(short));
		displayQuery(browse, "span.filter-button-subscriptions.scheduled", display(scheduled));
		displayQuery(browse, "span.filter-query", display(filterState.settings.keyword));
	}

	function setHashTagVisibility(browse, settings) {
		const { live, streamed, video, short, scheduled } = settings;
		displayQuery(browse, "span.filter-button-subscriptions.all", displayAny([live, streamed, video, short, scheduled]));
		displayQuery(browse, "span.filter-button-subscriptions.live", display(live));
		displayQuery(browse, "span.filter-button-subscriptions.streamed", display(streamed));
		displayQuery(browse, "span.filter-button-subscriptions.video", display(video));
		displayQuery(browse, "span.filter-button-subscriptions.short", display(short));
		displayQuery(browse, "span.filter-button-subscriptions.scheduled", display(scheduled));
		displayQuery(browse, "span.filter-query", display(filterState.settings.keyword));
	}

	function setPlaylistsVisibility(browse) {
		displayQuery(browse, "span.filter-button-subscriptions.all", "none");
		displayQuery(browse, "span.filter-query", display(filterState.settings.keyword));
	}

	function setChannelVisibility(browse, settings) {
		const { live, streamed, video, short, scheduled } = settings;
		displayQuery(browse, "span.filter-button-subscriptions.all", displayAny([live, streamed, video, short, scheduled]));
		displayQuery(browse, "span.filter-button-subscriptions.live", display(live));
		displayQuery(browse, "span.filter-button-subscriptions.streamed", display(streamed));
		displayQuery(browse, "span.filter-button-subscriptions.video", display(video));
		displayQuery(browse, "span.filter-button-subscriptions.short", display(short));
		displayQuery(browse, "span.filter-button-subscriptions.scheduled", display(scheduled));
		displayQuery(browse, "span.filter-query", display(filterState.settings.keyword));
	}

	function setShortsVisibility(browse) {
		displayQuery(browse, "span.filter-button-subscriptions.all", "none");
		displayQuery(browse, "span.filter-query", display(filterState.settings.keyword));
	}

	function setChannelsVisibility(browse, settings) {
		const { channels_all, channels_personalized, channels_none } = settings;
		displayQuery(
			browse,
			"span.filter-button-channels.all",
			displayAny([channels_all, channels_personalized, channels_none])
		);
		displayQuery(browse, "span.filter-button-channels.channels_all", display(channels_all));
		displayQuery(browse, "span.filter-button-channels.channels_personalized", display(channels_personalized));
		displayQuery(browse, "span.filter-button-channels.channels_none", display(channels_none));
		displayQuery(browse, "span.filter-query", display(filterState.settings.keyword));
	}

	function setTopVisibility(browse, settings) {
		const { live, streamed, video, short, scheduled } = settings;
		displayQuery(browse, "span.filter-button-subscriptions.all", displayAny([live, streamed, video, short, scheduled]));
		displayQuery(browse, "span.filter-button-subscriptions.live", display(live));
		displayQuery(browse, "span.filter-button-subscriptions.streamed", display(streamed));
		displayQuery(browse, "span.filter-button-subscriptions.video", display(video));
		displayQuery(browse, "span.filter-button-subscriptions.short", display(short));
		displayQuery(browse, "span.filter-button-subscriptions.scheduled", display(scheduled));
		displayQuery(browse, "span.filter-query", display(filterState.settings.keyword));
	}

	function updatePopupMenuVisibility(app) {
		for (const menu of app.querySelectorAll("form.filter-popup.filter-add-playlist")) {
			menu.style.display = display(filterState.settings.keyword_add_playlist);
		}

		for (const menu of app.querySelectorAll("form.filter-popup.filter-sidebar-channels")) {
			menu.style.display = display(filterState.settings.keyword_sidebar_channels);
		}

		for (const menu of app.querySelectorAll("form.filter-popup.filter-notification")) {
			menu.style.display = display(filterState.settings.keyword_notification);
		}
	}

	async function onNodeLoaded(node, is_menu_target) {
		// Handle different node types and update visibility
		switch (node.nodeName) {
			case "YTD-BROWSE":
			case "YTD-SECTION-LIST-RENDERER":
			case "YTD-TABBED-PAGE-HEADER":
			case "YTD-FEED-FILTER-CHIP-BAR-RENDERER":
				if (is_menu_target) {
					await insertMenu(node);
				}
				break;

			case "YTD-POPUP-CONTAINER":
			case "YT-MULTI-PAGE-MENU-SECTION-RENDERER":
			case "YTD-GUIDE-SECTION-RENDERER":
				insertPopupMenu(node);
				break;

			case "YTD-GRID-VIDEO-RENDERER":
			case "YTD-VIDEO-RENDERER":
			case "YTD-CHANNEL-RENDERER":
			case "YTD-BACKSTAGE-POST-THREAD-RENDERER":
			case "YTD-GRID-PLAYLIST-RENDERER":
			case "YTM-SHORTS-LOCKUP-VIEW-MODEL-V2":
			case "YTD-RICH-ITEM-RENDERER":
			case "YT-LOCKUP-VIEW-MODEL":
				if (is_menu_target) {
					updateTargetVisibility(node, filterState, lang, includesStatus, matchQuery);
				}
				break;

			case "YTD-ITEM-SECTION-RENDERER":
				if (is_menu_target) {
					updateVisibility(node, filterState, lang, selectors, includesStatus, matchQuery);
				}
				break;

			case "DIV":
				if (is_menu_target && node.id === "contents") {
					updateVisibility(node, filterState, lang, selectors, includesStatus, matchQuery);
				}
				if (["playlists", "items", "expandable-items"].includes(node.id)) {
					updatePopupVisibility([node], filterState, selectors, matchPopupQuery, getPopupKey);
				}
				break;

			case "YTD-CONTINUATION-ITEM-RENDERER":
				handleContinuationItem(node, common, filterState, load_button_container);
				break;
		}
	}

	async function insertMenu(node) {
		const browse = searchParentNode(node, "YTD-BROWSE");
		if (browse && !browse.querySelector("form.filter-menu:not(.filter-forCalc)")) {
			const referenceNode = getReferenceNode(browse);
			if (referenceNode) {
				const menu = createMenu(browse);
				referenceNode.insertBefore(menu, referenceNode.firstChild);

				const calc = createNodeForCalc(menu, browse);
				referenceNode.insertBefore(calc, referenceNode.firstChild);

				const spacerReferenceNode = getSpacerReferenceNode(browse);
				if (spacerReferenceNode) {
					spacerReferenceNode.parentNode.insertBefore(createSpacer("browse"), spacerReferenceNode);
				}

				await updateButtonVisibility(browse);
				displayQuery(browse, "form.filter-menu, div.filter-menu", "");
			}
		}
	}

	function getReferenceNode(browse) {
		if (forTwoColumnBrowseResultsRenderer(common)) {
			return browse.querySelector("ytd-two-column-browse-results-renderer").parentNode;
		} else if (forPageHeaderRenderer(common)) {
			return browse.querySelector("yt-page-header-renderer").parentNode;
		} else if (common.isTop(location.href)) {
			return browse.querySelector("div#scroll-container");
		} else {
			return browse;
		}
	}

	function getSpacerReferenceNode(browse) {
		if (needSpacer(common)) {
			return browse.firstChild;
		} else if (common.isTop(location.href)) {
			return browse.querySelector("div#contents");
		} else {
			return undefined;
		}
	}

	function createMenu(browse) {
		const menu = document.createElement("form");
		menu.style.display = "none";

		if (isPositionFixedTarget(common)) {
			menu.classList.add("filter-menu", "position-fixed");
		} else {
			menu.classList.add("filter-menu");
		}

		// Create menu elements
		menu.appendChild(
			createButton(
				common.button_label.all,
				"all",
				false,
				browse,
				common,
				(mode, multi, sub, browse) => changeMode(mode, multi, sub, browse, filterState, common),
				(browse) => updateVisibility(browse, filterState, lang, selectors, includesStatus, matchQuery),
				filterState.settings.multiselection
			)
		);

		menu.appendChild(
			createButton(
				common.button_label.live,
				"live",
				false,
				browse,
				common,
				(mode, multi, sub, browse) => changeMode(mode, multi, sub, browse, filterState, common),
				(browse) => updateVisibility(browse, filterState, lang, selectors, includesStatus, matchQuery),
				filterState.settings.multiselection
			)
		);

		menu.appendChild(
			createButton(
				common.button_label.streamed,
				"streamed",
				false,
				browse,
				common,
				(mode, multi, sub, browse) => changeMode(mode, multi, sub, browse, filterState, common),
				(browse) => updateVisibility(browse, filterState, lang, selectors, includesStatus, matchQuery),
				filterState.settings.multiselection
			)
		);

		menu.appendChild(
			createButton(
				common.button_label.video,
				"video",
				false,
				browse,
				common,
				(mode, multi, sub, browse) => changeMode(mode, multi, sub, browse, filterState, common),
				(browse) => updateVisibility(browse, filterState, lang, selectors, includesStatus, matchQuery),
				filterState.settings.multiselection
			)
		);

		menu.appendChild(
			createButton(
				common.button_label.short,
				"short",
				false,
				browse,
				common,
				(mode, multi, sub, browse) => changeMode(mode, multi, sub, browse, filterState, common),
				(browse) => updateVisibility(browse, filterState, lang, selectors, includesStatus, matchQuery),
				filterState.settings.multiselection
			)
		);

		menu.appendChild(
			createButton(
				common.button_label.scheduled,
				"scheduled",
				false,
				browse,
				common,
				(mode, multi, sub, browse) => changeMode(mode, multi, sub, browse, filterState, common),
				(browse) => updateVisibility(browse, filterState, lang, selectors, includesStatus, matchQuery),
				filterState.settings.multiselection
			)
		);

		// Progress buttons
		menu.appendChild(
			createButton(
				common.button_label.progress_unwatched,
				"progress_unwatched",
				false,
				browse,
				common,
				(mode, multi, sub, browse) => changeModeProgress(mode, multi, sub, browse, filterState, common),
				(browse) => updateVisibility(browse, filterState, lang, selectors, includesStatus, matchQuery),
				filterState.settings.multiselection
			)
		);

		menu.appendChild(
			createButton(
				common.button_label.progress_watched,
				"progress_watched",
				false,
				browse,
				common,
				(mode, multi, sub, browse) => changeModeProgress(mode, multi, sub, browse, filterState, common),
				(browse) => updateVisibility(browse, filterState, lang, selectors, includesStatus, matchQuery),
				filterState.settings.multiselection
			)
		);

		const select = createSelect(
			browse,
			(mode, multi, sub, browse) => changeMode(mode, multi, sub, browse, filterState, common),
			(browse) => updateVisibility(browse, filterState, lang, selectors, includesStatus, matchQuery),
			filterState.settings.multiselection
		);

		select.appendChild(createOption(common.button_label.placeholder));
		select.appendChild(createOption(common.button_label.all, "all"));
		select.appendChild(createOption(common.button_label.live, "live"));
		select.appendChild(createOption(common.button_label.streamed, "streamed"));
		select.appendChild(createOption(common.button_label.video, "video"));
		select.appendChild(createOption(common.button_label.short, "short"));
		select.appendChild(createOption(common.button_label.scheduled, "scheduled"));

		menu.appendChild(select);

		const input = createQueryInput(menu, browse, filterState);
		menu.appendChild(
			createQueryInputArea(
				input,
				browse,
				filterState,
				(browse) => updateVisibility(browse, filterState, lang, selectors, includesStatus, matchQuery),
				updateQueryRegex
			)
		);
		menu.appendChild(
			createSearchButton(
				input,
				browse,
				filterState,
				(browse) => updateVisibility(browse, filterState, lang, selectors, includesStatus, matchQuery),
				updateQueryRegex
			)
		);

		menu.addEventListener("submit", (e) => {
			e.preventDefault();
			updateQueryRegex(browse, input.value, filterState);
			updateVisibility(browse, filterState, lang, selectors, includesStatus, matchQuery);
			window.scroll({ top: 0, behavior: "instant" });
		});

		return menu;
	}

	function insertPopupMenu(node) {
		// Handle popup menu insertion for different container types
		if (node.nodeName === "YTD-POPUP-CONTAINER") {
			const containers = [node.querySelector("div#playlists, div#items, div#expandable-items")].filter(Boolean);
			if (containers.length > 0) {
				updatePopupVisibility(containers, filterState, selectors, matchPopupQuery, getPopupKey);
			}
		} else if (
			node.nodeName === "YT-MULTI-PAGE-MENU-SECTION-RENDERER" ||
			node.nodeName === "YTD-GUIDE-SECTION-RENDERER"
		) {
			const containers = [node].filter(Boolean);
			if (containers.length > 0) {
				updatePopupVisibility(containers, filterState, selectors, matchPopupQuery, getPopupKey);
			}
		}
	}

	function onResize() {
		if (isMenuTarget(common)) {
			if (filterState.settings.responsive) {
				for (const form of app.querySelectorAll('ytd-browse[role="main"] form.filter-menu:not(.filter-forCalc)')) {
					for (const calc of form.parentNode.querySelectorAll("form.filter-forCalc")) {
						form.parentNode.insertBefore(calc, form);
						if (calc.scrollWidth <= form.parentNode.clientWidth) {
							document.documentElement.style.setProperty("--filter-button-display", "inline-flex");
							document.documentElement.style.setProperty("--filter-menu-display", "none");
						} else {
							document.documentElement.style.setProperty("--filter-button-display", "none");
							document.documentElement.style.setProperty("--filter-menu-display", "block");
						}
					}
				}
			} else {
				document.documentElement.style.setProperty("--filter-button-display", "inline-flex");
				document.documentElement.style.setProperty("--filter-menu-display", "none");
			}
		}
	}

	async function onViewChanged() {
		for (const browse of app.querySelectorAll("ytd-browse")) {
			await updateButtonVisibility(browse);
			displayQuery(browse, "form.filter-menu, div.filter-menu", display(isMenuTarget(common)));
			updateVisibility(browse, filterState, lang, selectors, includesStatus, matchQuery);
		}
	}

	// Event listeners
	document.addEventListener("yt-navigate-finish", async () => {
		await onViewChanged();
	});

	document.addEventListener("yt-action", async () => {
		await onResize();
	});

	chrome.storage.onChanged.addListener(async () => {
		for (const browse of app.querySelectorAll("ytd-browse")) {
			await updateButtonVisibility(browse);
		}
	});

	new MutationObserver((mutations) => {
		const is_menu_target = isMenuTarget(common);
		for (const m of mutations) {
			onNodeLoaded(m.target, is_menu_target);
		}
	}).observe(app, { subtree: true, childList: true });
}

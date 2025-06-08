export function updateVisibility(node, filterState, lang, selectors, includesStatus, matchQuery) {
	node
		.querySelectorAll(selectors.videoRenderers)
		.forEach((n) => updateTargetVisibility(n, filterState, lang, includesStatus, matchQuery));
}

export function updateTargetVisibility(node, filterState, lang, includesStatus, matchQuery) {
	if (node.classList.contains("filter-separator")) {
		node.style.display = "";
		node.classList.add("filter-show");
		node.classList.remove("filter-hidden");
	} else if (
		includesStatus(node, filterState.getActiveMode(), filterState.getActiveModeProgress(), lang) &&
		matchTextContent(node, filterState, matchQuery)
	) {
		node.style.display = "";
		node.classList.add("filter-show");
		node.classList.remove("filter-hidden");
	} else {
		node.style.display = "none";
		node.classList.remove("filter-show");
		node.classList.add("filter-hidden");
	}
}

export function updatePopupVisibility(containers, filterState, selectors, matchPopupQuery, getPopupKey) {
	for (const container of containers) {
		container
			.querySelectorAll(selectors.popupTargets)
			.forEach((target) => updatePopupTargetVisibility(container, target, filterState, matchPopupQuery, getPopupKey));
	}
}

export function updatePopupTargetVisibility(container, target, filterState, matchPopupQuery, getPopupKey) {
	if (matchPopupQuery(container, target, filterState, getPopupKey)) {
		target.style.display = "";
	} else {
		target.style.display = "none";
	}
}

function matchTextContent(node, filterState, matchQuery) {
	let text_node;
	switch (node.nodeName) {
		// subscriptions?flow=1, library
		case "YTD-GRID-VIDEO-RENDERER":
			text_node = node.querySelector("a#video-title");
			if (text_node) {
				return matchQuery(text_node.textContent, filterState);
			}
			console.warn("text node not found");
			break;

		// subscriptions?flow=2, history
		case "YTD-VIDEO-RENDERER":
			if (!node.classList.contains("ytd-backstage-post-renderer")) {
				text_node = node.querySelector("a#video-title");
				if (text_node) {
					return matchQuery(text_node.textContent, filterState);
				}
				console.warn("text node not found");
			} else {
				// lazy load
			}
			break;

		// playlist
		case "YTD-PLAYLIST-VIDEO-RENDERER":
			text_node = node.querySelector("div#meta");
			if (text_node) {
				return matchQuery(text_node.textContent, filterState);
			}
			console.warn("text node not found");
			break;

		// channel
		case "YTD-BACKSTAGE-POST-THREAD-RENDERER":
			text_node = node.querySelector("div#content");
			if (text_node) {
				return matchQuery(text_node.textContent, filterState);
			}
			console.warn("text node not found");
			break;

		case "YTD-GRID-PLAYLIST-RENDERER":
			text_node = node.querySelector("a#video-title");
			if (text_node) {
				return matchQuery(text_node.textContent, filterState);
			}
			console.warn("text node not found");
			break;

		// channel, playlists, shorts, library
		case "YTD-RICH-ITEM-RENDERER":
		case "YTM-SHORTS-LOCKUP-VIEW-MODEL-V2":
		case "YT-LOCKUP-VIEW-MODEL":
			text_node = node.querySelector(
				"h3.shortsLockupViewModelHostMetadataTitle, h3.shortsLockupViewModelHostOutsideMetadataTitle"
			);
			if (text_node) {
				return matchQuery(text_node.getAttribute("aria-label"), filterState);
			}

			text_node = node.querySelector("h3.ytd-rich-grid-media, .ytd-rich-grid-slim-media, .yt-core-attributed-string");
			if (text_node) {
				return matchQuery(text_node.textContent, filterState);
			}
			// YT-LOCKUP-VIEW-MODEL content lazy load
			break;

		// channels
		case "YTD-CHANNEL-RENDERER":
			text_node = node.querySelector("div#info");
			if (text_node) {
				return matchQuery(text_node.textContent, filterState);
			}
			console.warn("text node not found");
			break;
	}

	// default: visible
	return true;
}

export function handleContinuationItem(node, common, filterState, load_button_container) {
	if (common.isSubscriptions(location.href) || common.isShorts(location.href)) {
		if (node.parentNode.children.length > filterState.settings.limit) {
			load_button_container.style.display = "";
			node.style.display = "none";
			node.classList.remove("filter-show");
			node.classList.add("filter-hidden");
			node.parentNode.parentNode.appendChild(load_button_container);
			filterState.continuation_item = node;
		}
	}
}

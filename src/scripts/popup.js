import(chrome.runtime.getURL('src/scripts/common.js')).then((common) =>
	import(chrome.runtime.getURL('src/scripts/settings.js')).then((settings) =>
		import(chrome.runtime.getURL('src/scripts/progress.js')).then((progress) =>
			chrome.storage.local.get(common.storage, (data) => main(common, settings, progress, data))
		)
	)
);

function main(common, settings, progress, data) {
	const groups = ['subscriptions', 'progress', 'channels'];

	const settings_list_1 = document.body.querySelector('div#settings_list_1');
	const settings_list_2 = document.body.querySelector('div#settings_list_2');
	const settings_list_3 = document.body.querySelector('div#settings_list_3');
	const settings_list_4 = document.body.querySelector('div#settings_list_4');
	const settings_list_5 = document.body.querySelector('div#settings_list_5');
	const settings_list_6 = document.body.querySelector('div#settings_list_6');
	const settings_lists = [
		settings_list_1,
		settings_list_2,
		settings_list_3,
		settings_list_4,
		settings_list_5,
		settings_list_6,
	];

	const progress_class = 'progress';
	const done_class = 'done';

	const reset_button = document.body.querySelector('input#reset');
	const progress_div = document.body.querySelector('div#reset_progress');

	settings.init(groups, settings_lists);

	settings_list_1.appendChild(
		settings.createHeaderRow(common.button_label.visibility, common.button_label.default, 'header-main')
	);
	settings_list_1.appendChild(
		settings.createRow(
			data.button_label_live,
			common.button_label.live,
			'live',
			data.live,
			true,
			data.default_live ? data.default_live : false,
			'subscriptions',
			(input) => chrome.storage.local.set({ button_label_live: input.value }),
			common.button_label.clear
		)
	);
	settings_list_1.appendChild(
		settings.createRow(
			data.button_label_streamed,
			common.button_label.streamed,
			'streamed',
			data.streamed,
			true,
			data.default_streamed ? data.default_streamed : false,
			'subscriptions',
			(input) => chrome.storage.local.set({ button_label_streamed: input.value }),
			common.button_label.clear
		)
	);
	settings_list_1.appendChild(
		settings.createRow(
			data.button_label_video,
			common.button_label.video,
			'video',
			data.video,
			true,
			data.default_video ? data.default_video : false,
			'subscriptions',
			(input) => chrome.storage.local.set({ button_label_video: input.value }),
			common.button_label.clear
		)
	);
	settings_list_1.appendChild(
		settings.createRow(
			data.button_label_short,
			common.button_label.short,
			'short',
			data.short,
			true,
			undefined,
			'subscriptions',
			(input) => chrome.storage.local.set({ button_label_short: input.value }),
			common.button_label.clear
		)
	);
	settings_list_1.appendChild(
		settings.createRow(
			data.button_label_scheduled,
			common.button_label.scheduled,
			'scheduled',
			data.scheduled,
			true,
			data.default_scheduled ? data.default_scheduled : false,
			'subscriptions',
			(input) => chrome.storage.local.set({ button_label_scheduled: input.value }),
			common.button_label.clear
		)
	);
	settings_list_1.appendChild(
		settings.createRow(
			data.button_label_notification_on,
			common.button_label.notification_on,
			'notification_on',
			data.notification_on,
			false,
			data.default_notification_on ? data.default_notification_on : false,
			'subscriptions',
			(input) => chrome.storage.local.set({ button_label_notification_on: input.value }),
			common.button_label.clear
		)
	);
	settings_list_1.appendChild(
		settings.createRow(
			data.button_label_notification_off,
			common.button_label.notification_off,
			'notification_off',
			data.notification_off,
			false,
			data.default_notification_off ? data.default_notification_off : false,
			'subscriptions',
			(input) => chrome.storage.local.set({ button_label_notification_off: input.value }),
			common.button_label.clear
		)
	);
	settings_list_1.appendChild(
		settings.createRow(
			data.button_label_progress_unwatched,
			common.button_label.progress_unwatched,
			'progress_unwatched',
			data.progress_unwatched,
			true,
			data.default_progress_unwatched ? data.default_progress_unwatched : false,
			'progress',
			(input) => chrome.storage.local.set({ button_label_progress_unwatched: input.value }),
			common.button_label.clear
		)
	);
	settings_list_1.appendChild(
		settings.createRow(
			data.button_label_progress_watched,
			common.button_label.progress_watched,
			'progress_watched',
			data.progress_watched,
			true,
			data.default_progress_watched ? data.default_progress_watched : false,
			'progress',
			(input) => chrome.storage.local.set({ button_label_progress_watched: input.value }),
			common.button_label.clear
		)
	);
	settings_list_1.appendChild(
		settings.createRow(
			data.button_label_progress_watching,
			common.button_label.progress_watching,
			'progress_watching',
			data.progress_watching,
			true,
			data.default_progress_watching ? data.default_progress_watching : false,
			'progress',
			(input) => chrome.storage.local.set({ button_label_progress_watching: input.value }),
			common.button_label.clear
		)
	);
	settings_list_1.appendChild(
		settings.createRow(
			data.button_label_queue_top_n,
			common.button_label.queue_top_n,
			'queue_top_n',
			data.queue_top_n,
			true,
			data.default_queue_top_n ? data.default_queue_top_n : false,
			'subscriptions',
			(input) => chrome.storage.local.set({ button_label_queue_top_n: input.value }),
			common.button_label.clear
		)
	);

	settings_list_6.appendChild(
		settings.createRow(
			common.button_label.keyword_add_playlist,
			undefined,
			'keyword_add_playlist',
			data.keyword_add_playlist,
			true
		)
	);
	settings_list_6.appendChild(
		settings.createRow(
			common.button_label.keyword_sidebar_channels,
			undefined,
			'keyword_sidebar_channels',
			data.keyword_sidebar_channels,
			true
		)
	);
	settings_list_6.appendChild(
		settings.createRow(
			common.button_label.keyword_notification,
			undefined,
			'keyword_notification',
			data.keyword_notification,
			true
		)
	);

	settings_list_3.appendChild(
		settings.createRow(
			common.button_label.channels_all,
			undefined,
			'channels_all',
			data.channels_all,
			true,
			data.default_channels_all ? data.default_channels_all : false,
			'channels'
		)
	);
	settings_list_3.appendChild(
		settings.createRow(
			common.button_label.channels_personalized,
			undefined,
			'channels_personalized',
			data.channels_personalized,
			true,
			data.default_channels_personalized ? data.default_channels_personalized : false,
			'channels'
		)
	);
	settings_list_3.appendChild(
		settings.createRow(
			common.button_label.channels_none,
			undefined,
			'channels_none',
			data.channels_none,
			true,
			data.default_channels_none ? data.default_channels_none : false,
			'channels'
		)
	);

	settings_list_4.appendChild(
		settings.createRow(common.button_label.multiselection, undefined, 'multiselection', data.multiselection, false)
	);
	settings_list_4.appendChild(
		settings.createRow(common.button_label.responsive, undefined, 'responsive', data.responsive, true)
	);
	settings_list_4.appendChild(
		settings.createRow(
			common.button_label.limit,
			undefined,
			'limit',
			data.limit,
			common.defaultLimit,
			undefined,
			undefined,
			(input) =>
				chrome.storage.local.set({
					limit: common.limit(input.value, common.defaultLimit, common.minLimit, common.maxLimit, common.stepLimit),
				}),
			undefined,
			'step',
			common.minLimit,
			common.maxLimit,
			common.stepLimit,
			common.limit
		)
	);
	settings_list_4.appendChild(
		settings.createRow(
			common.button_label.queue_count || 'Queue Count',
			undefined,
			'queue_count',
			data.queue_count,
			common.default_queue_count,
			undefined,
			undefined,
			(input) =>
				chrome.storage.local.set({
					queue_count: Math.max(1, Math.min(20, parseInt(input.value) || common.default_queue_count)),
				}),
			undefined,
			'step',
			1,
			20,
			1,
			(value) => Math.max(1, Math.min(20, parseInt(value) || common.default_queue_count))
		)
	);

	settings_list_5.appendChild(
		settings.createHeaderRow(common.button_label.visibility, common.button_label.default, 'header-keyword')
	);
	settings_list_5.appendChild(
		settings.createRowKeyword(
			common.button_label.keyword,
			'keyword',
			data.keyword,
			true,
			data.default_keyword,
			(input) => chrome.storage.local.set({ default_keyword: input.value }),
			common.button_label.clear
		)
	);

	for (const settings_list of settings_lists) {
		for (const mode of common.order(data.order)) {
			const row = settings_list.querySelector('div.row.' + mode);
			if (row) {
				settings_list.appendChild(row);
				row.style.display = '';
			}
		}

		for (const div of settings_list.querySelectorAll('div.row')) {
			const draggable_label = div.querySelector('div.draggable-label');
			if (draggable_label) {
				settings.registerDraggableRow(div, draggable_label);
			}
		}
	}

	for (const settings_list of settings_lists) {
		for (const input of settings_list.querySelectorAll('input.visibility_checkbox')) {
			input.addEventListener('change', () => {
				let ids = {};

				if (!input.checked) {
					const mode = 'default_' + input.id;
					const checkbox = settings_list.querySelector('input#' + mode);
					if (checkbox) {
						checkbox.checked = false;
						ids[mode] = false;
					}
				}

				ids[input.id] = input.checked;
				chrome.storage.local.set(ids);
			});
		}

		for (const group of groups) {
			for (const input of settings_list.querySelectorAll('input.default_checkbox.' + group)) {
				input.addEventListener('change', () => {
					chrome.storage.local.get(common.storage, (data) => {
						let ids = {};

						if (input.checked) {
							const mode = input.id.substring(8);
							const checkbox = settings_list.querySelector('input#' + mode);
							if (checkbox) {
								checkbox.checked = true;
								ids[mode] = true;
							}
						}

						if (input.checked && !data.multiselection) {
							settings_list.querySelectorAll('input.default_checkbox.' + group).forEach((n) => {
								if (n !== input) {
									n.checked = false;
									ids[n.id] = false;
								}
							});
						}

						ids[input.id] = input.checked;
						chrome.storage.local.set(ids);
					});
				});
			}
		}
	}

	settings.registerResetButton(reset_button, progress_div, progress_class, done_class, common.default_order, progress);

	chrome.storage.onChanged.addListener(() => {
		chrome.storage.local.get(common.storage, (data) => {
			if (!data.multiselection) {
				let ids = {};
				for (const group of groups) {
					let first = true;
					for (const settings_list of settings_lists) {
						settings_list.querySelectorAll('input:checked.default_checkbox.' + group).forEach((n) => {
							if (first) {
								first = false;
							} else {
								n.checked = false;
								ids[n.id] = false;
							}
						});
					}
				}
				chrome.storage.local.set(ids);
			}
		});
	});
}

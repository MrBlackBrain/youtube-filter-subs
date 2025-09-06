export function changeMode(mode, multi, sub, browse, filterState, common) {
	const modes = multi ? filterState.getActiveMode() : new Set();

	if (!mode) {
		if (common.isSubscriptions(location.href)) {
			if (filterState.defaultTab.live) modes.add('live');
			if (filterState.defaultTab.streamed) modes.add('streamed');
			if (filterState.defaultTab.video) modes.add('video');
			if (filterState.defaultTab.short) modes.add('short');
			if (filterState.defaultTab.scheduled) modes.add('scheduled');
			if (filterState.defaultTab.notification_on) modes.add('notification_on');
			if (filterState.defaultTab.notification_off) modes.add('notification_off');
			if (modes.size === 0) modes.add('all');
		} else if (common.isChannels(location.href)) {
			if (filterState.defaultTab.channels_all) modes.add('channels_all');
			if (filterState.defaultTab.channels_personalized) modes.add('channels_personalized');
			if (filterState.defaultTab.channels_none) modes.add('channels_none');
			if (modes.size === 0) modes.add('all');
		} else {
			modes.add('all');
		}
	} else {
		if (multi && sub) {
			modes.delete(mode);
			if (modes.size === 0) {
				modes.add('all');
			}
		} else {
			if (mode === 'all') {
				modes.clear();
			} else {
				modes.delete('all');
			}
			modes.add(mode);
		}
	}

	filterState.setActiveMode(modes, browse);

	browse
		.querySelectorAll('span.filter-button-subscriptions, span.filter-button-channels')
		.forEach((n) => n.classList.remove('selected'));
	browse.querySelectorAll('option.filter-button-subscriptions, option.filter-button-channels').forEach((n) => {
		n.selected = false;
		n.classList.remove('selected');

		const i = n.innerHTML.indexOf('✔ ');
		if (i !== -1) {
			n.innerHTML = n.innerHTML.substring(i + 1);
		}
	});

	if (common.isChannels(location.href)) {
		for (const mode of modes) {
			browse.querySelectorAll('span.filter-button-channels.' + mode).forEach((n) => n.classList.add('selected'));
		}
	} else {
		for (const mode of modes) {
			browse.querySelectorAll('span.filter-button-subscriptions.' + mode).forEach((n) => n.classList.add('selected'));
			browse.querySelectorAll('option.filter-button-subscriptions.' + mode).forEach((n) => {
				n.classList.add('selected');

				if (multi) {
					const i = n.innerHTML.indexOf('✔ ');
					if (i === -1) {
						n.innerHTML = '✔ ' + n.innerHTML;
					}
				}
			});
		}

		if (multi) {
			browse.querySelectorAll('option.filter-button-subscriptions.placeholder').forEach((n) => (n.selected = true));
		} else {
			browse.querySelectorAll('option.filter-button-subscriptions.selected').forEach((n) => (n.selected = true));
		}
	}
}

export function changeModeProgress(mode, multi, sub, browse, filterState, common) {
	// Always enable multi-selection for progress buttons
	const modes = filterState.getActiveModeProgress();

	if (!mode) {
		if (common.isSubscriptions(location.href)) {
			if (filterState.defaultTab.progress_unwatched) modes.add('progress_unwatched');
			if (filterState.defaultTab.progress_watched) modes.add('progress_watched');
			if (filterState.defaultTab.progress_watching) modes.add('progress_watching');
			// Don't default to 'progress_all' - let it be empty to show all videos by default
		} else {
			// Don't default to 'progress_all' - let it be empty to show all videos by default
		}
	} else {
		// Progress buttons always use multi-selection behavior
		if (sub) {
			// If the button is already selected, deselect it (toggle behavior)
			modes.delete(mode);
			// Don't add 'progress_all' when set becomes empty - let it be empty to show all videos
			// When a progress button is deselected, reset main filter to show all videos
			if (sub && (mode === 'progress_unwatched' || mode === 'progress_watched' || mode === 'progress_watching')) {
				const mainModes = new Set(['all']);
				filterState.setActiveMode(mainModes, browse);
				// Update main filter UI
				browse
					.querySelectorAll('span.filter-button-subscriptions, span.filter-button-channels')
					.forEach((n) => n.classList.remove('selected'));
				browse.querySelectorAll('span.filter-button-subscriptions.all').forEach((n) => n.classList.add('selected'));
				browse.querySelectorAll('option.filter-button-subscriptions').forEach((n) => {
					n.selected = false;
					n.classList.remove('selected');
					const i = n.innerHTML.indexOf('✔ ');
					if (i !== -1) {
						n.innerHTML = n.innerHTML.substring(i + 1);
					}
				});
				browse.querySelectorAll('option.filter-button-subscriptions.all').forEach((n) => {
					n.classList.add('selected');
					n.selected = true;
				});
			}
		} else {
			// Button is not currently selected, so select it
			if (mode === 'progress_all') {
				modes.clear();
			} else {
				modes.delete('progress_all');
			}
			modes.add(mode);
		}
	}

	filterState.setActiveModeProgress(modes, browse);

	// Remove selected state from all progress buttons
	browse
		.querySelectorAll(
			'span.filter-button.progress_unwatched, span.filter-button.progress_watched, span.filter-button.progress_watching'
		)
		.forEach((n) => n.classList.remove('selected'));

	browse.querySelectorAll('option.filter-button-progress').forEach((n) => {
		n.selected = false;
		n.classList.remove('selected');

		const i = n.innerHTML.indexOf('✔ ');
		if (i !== -1) {
			n.innerHTML = n.innerHTML.substring(i + 1);
		}
	});

	// Add selected state to active progress buttons
	for (const mode of modes) {
		browse.querySelectorAll('span.filter-button.' + mode).forEach((n) => n.classList.add('selected'));

		browse.querySelectorAll('option.filter-button-progress.' + mode).forEach((n) => {
			n.classList.add('selected');

			// Always show checkmarks for progress buttons since they're always multi-selectable
			const i = n.innerHTML.indexOf('✔ ');
			if (i === -1) {
				n.innerHTML = '✔ ' + n.innerHTML;
			}
		});
	}

	// Don't auto-select placeholder options - let user choose their filters
	// browse.querySelectorAll('option.filter-button-progress.placeholder').forEach((n) => (n.selected = true));
}

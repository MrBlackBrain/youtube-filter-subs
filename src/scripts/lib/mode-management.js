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
	const modes = multi ? filterState.getActiveModeProgress() : new Set();

	if (!mode) {
		if (common.isSubscriptions(location.href)) {
			if (filterState.defaultTab.progress_unwatched) modes.add('progress_unwatched');
			if (filterState.defaultTab.progress_watched) modes.add('progress_watched');
			if (modes.size === 0) modes.add('progress_all');
		} else {
			modes.add('progress_all');
		}
	} else {
		if (multi && sub) {
			modes.delete(mode);
			if (modes.size === 0) {
				modes.add('progress_all');
			}
			// When a progress button is deselected, reset main filter to show all videos
			if (sub && (mode === 'progress_unwatched' || mode === 'progress_watched')) {
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
			// Handle single-selection mode deselection
			if (!multi && sub && (mode === 'progress_unwatched' || mode === 'progress_watched')) {
				// If clicking an already selected progress button in single-selection mode, deselect it
				modes.clear();
				modes.add('progress_all');
				// Reset main filter to show all videos
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
			} else {
				// Normal selection logic
				if (mode === 'progress_all') {
					modes.clear();
				} else {
					modes.delete('progress_all');
				}
				modes.add(mode);
			}
		}
	}

	filterState.setActiveModeProgress(modes, browse);

	// Remove selected state from all progress buttons
	browse
		.querySelectorAll('span.filter-button.progress_unwatched, span.filter-button.progress_watched')
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

			if (multi) {
				const i = n.innerHTML.indexOf('✔ ');
				if (i === -1) {
					n.innerHTML = '✔ ' + n.innerHTML;
				}
			}
		});
	}

	if (multi) {
		browse.querySelectorAll('option.filter-button-progress.placeholder').forEach((n) => (n.selected = true));
	} else {
		browse.querySelectorAll('option.filter-button-progress.selected').forEach((n) => (n.selected = true));
	}
}

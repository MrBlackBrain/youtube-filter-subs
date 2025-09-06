export class FilterState {
	constructor() {
		this.active = {
			mode: new Map(),
			mode_progress: new Map(),
			query: new Map(),
			regex: new Map(),
			notRegex: new Map(),
		};

		this.defaultTab = {
			live: false,
			streamed: false,
			video: false,
			short: false,
			scheduled: false,
			notification_on: false,
			notification_off: false,
			progress_unwatched: false,
			progress_watched: false,
			progress_watching: false,
			channels_all: false,
			channels_personalized: false,
			channels_none: false,
		};

		this.settings = {
			keyword: false,
			default_keyword: '',
			multiselection: false,
			responsive: false,
			limit: 50,
			keyword_add_playlist: false,
			keyword_sidebar_channels: false,
			keyword_notification: false,
			queue_count: 3,
			queue_reverse_order: false,
		};

		this.popupMenu = new Map();
		this.continuation_item = null;
	}

	getActiveMode() {
		const mode = this.active.mode.get(location.href);
		return mode || new Set();
	}

	getActiveModeProgress() {
		const mode = this.active.mode_progress.get(location.href);
		return mode || new Set();
	}

	setActiveMode(mode, browse) {
		this.active.mode.set(location.href, mode);
		browse.setAttribute('filter-mode', [...mode].join(' '));
	}

	setActiveModeProgress(mode_progress, browse) {
		this.active.mode_progress.set(location.href, mode_progress);
		browse.setAttribute('filter-mode-progress', [...mode_progress].join(' '));
	}

	getActiveQuery(browse) {
		const query = this.active.query.get(location.href);
		if (query) {
			return query;
		} else if (location.href.includes('/feed/subscriptions')) {
			this.active.query.set(location.href, this.settings.default_keyword);
			browse.setAttribute('filter-query', this.settings.default_keyword);
			return this.settings.default_keyword;
		} else {
			this.active.query.set(location.href, '');
			browse.setAttribute('filter-query', '');
			return '';
		}
	}

	setActiveQuery(query) {
		this.active.query.set(location.href, query);
	}

	updateSettings(data, common) {
		// Update settings from storage data
		Object.keys(this.settings).forEach((key) => {
			if (data[key] !== undefined) {
				this.settings[key] = common.value(data[key], common[`default_${key}`]);
			}
		});

		// Update default tab settings
		Object.keys(this.defaultTab).forEach((key) => {
			if (data[`default_${key}`] !== undefined) {
				this.defaultTab[key] = common.value(data[`default_${key}`], common[`default_default_${key}`]);
			}
		});
	}
}

export const filterState = new FilterState();

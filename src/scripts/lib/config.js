export const defaultConfig = {
	live: false,
	streamed: false,
	video: false,
	short: false,
	scheduled: false,
	notification_on: false,
	notification_off: false,
	progress_unwatched: false,
	progress_watched: false,
	channels_all: false,
	channels_personalized: false,
	channels_none: false,
	keyword: false,
	multiselection: false,
	responsive: false,
	keyword_add_playlist: false,
	keyword_sidebar_channels: false,
	keyword_notification: false,
	default_keyword: '',
};

export const buttonLabels = {
	all: 'All',
	live: 'Live',
	streamed: 'Streamed',
	video: 'Video',
	short: 'Short',
	scheduled: 'Scheduled',
	notification_on: 'Notifications On',
	notification_off: 'Notifications Off',
	progress_placeholder: 'Progress Filter',
	progress_all: 'All Progress',
	progress_unwatched: 'Unwatched',
	progress_watched: 'Watched',
	channels_all: 'All Notifications',
	channels_personalized: 'Personalized',
	channels_none: 'None',
	placeholder: 'Content Filter',
	clear: 'Clear',
	search: 'Search',
	load: 'Load More',
};

export const selectors = {
	videoRenderers:
		'yt-lockup-view-model, ytd-backstage-post-thread-renderer, ytd-channel-renderer, ytd-grid-playlist-renderer, ytd-grid-video-renderer, ytd-playlist-video-renderer, ytd-rich-item-renderer, ytd-video-renderer:not(.ytd-backstage-post-renderer), ytm-shorts-lockup-view-model-v2',
	popupTargets:
		'ytd-playlist-add-to-option-renderer, ytd-notification-renderer, ytd-guide-entry-renderer:not(#expander-item):not(#collapser-item):not(:has(a#endpoint[href="/feed/channels"]))',
};

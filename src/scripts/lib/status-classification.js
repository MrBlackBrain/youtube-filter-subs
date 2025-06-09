export function classifyStatus(node, lang) {
	const status = new Set();

	switch (node.nodeName) {
		case 'YTD-GRID-VIDEO-RENDERER':
		case 'YTD-VIDEO-RENDERER':
		case 'YTD-RICH-ITEM-RENDERER':
		case 'YTD-PLAYLIST-VIDEO-RENDERER': {
			const metadata_line = node.querySelector('div#metadata-line');
			const byline_container = node.querySelector('div#byline-container');
			const badge = node.querySelector('p.ytd-badge-supported-renderer');
			if (metadata_line || byline_container || badge) {
				const t = (metadata_line?.textContent ?? '') + '\n' + (byline_container?.textContent ?? '');
				const l = badge?.textContent ?? '';
				if (lang.isLive_metadata(t) || lang.isLive_status_label(l)) {
					status.add('live');
				} else if (lang.isStreamed_metadata(t)) {
					status.add('streamed');
				} else if (lang.isScheduled_metadata(t)) {
					status.add('scheduled');

					const video_button = node.querySelector('yt-button-shape');
					if (video_button) {
						const t = video_button.textContent;
						if (lang.isNotificationOn_button(t)) {
							status.add('notification_on');
						} else if (lang.isNotificationOff_button(t)) {
							status.add('notification_off');
						}
					}
				} else {
					const thumbnail_overlay = node.querySelector('ytd-thumbnail-overlay-time-status-renderer');
					if (thumbnail_overlay) {
						const overlay_style = thumbnail_overlay.getAttribute('overlay-style');
						if (overlay_style) {
							if (overlay_style === 'DEFAULT') {
								status.add('video');
							} else if (overlay_style === 'SHORTS') {
								status.add('short');
							} else {
								status.add('video'); // membership only video
							}
						}
					}

					const slim_media = node.querySelector('ytd-rich-grid-slim-media');
					if (slim_media) {
						status.add('short');
					}
				}
			} else {
				const shorts = node.querySelector('ytm-shorts-lockup-view-model-v2');
				if (shorts) {
					status.add('short');
				}
			}
			break;
		}

		case 'YTD-CHANNEL-RENDERER': {
			const channel_notification = node.querySelector(
				'ytd-subscription-notification-toggle-button-renderer-next button[aria-label]'
			);
			if (channel_notification) {
				const t = channel_notification.getAttribute('aria-label');
				if (lang.isChannelsAllNotifications(t)) {
					status.add('channels_all');
				} else if (lang.isChannelsPersonalizedNotifications(t)) {
					status.add('channels_personalized');
				} else if (lang.isChannelsNoNotifications(t)) {
					status.add('channels_none');
				}
			}
			break;
		}

		case 'YTM-SHORTS-LOCKUP-VIEW-MODEL-V2': {
			status.add('short');
			break;
		}
	}
	return status;
}

export function classifyStatusProgress(node) {
	const status = new Set();

	switch (node.nodeName) {
		case 'YTD-GRID-VIDEO-RENDERER':
		case 'YTD-VIDEO-RENDERER':
		case 'YTD-RICH-ITEM-RENDERER':
		case 'YTD-PLAYLIST-VIDEO-RENDERER': {
			// Look for YouTube's resume playback indicator
			const resumePlaybackRenderer = node.querySelector('ytd-thumbnail-overlay-resume-playback-renderer');

			if (resumePlaybackRenderer) {
				// Video has been started - check if it's fully watched or partially watched
				const progressDiv = resumePlaybackRenderer.querySelector('div#progress');

				if (progressDiv) {
					// Get the width style attribute to determine progress
					const widthStyle = progressDiv.style.width;

					if (widthStyle) {
						// Extract percentage value from width style (e.g., "100%" -> 100, "31%" -> 31)
						const widthMatch = widthStyle.match(/(\d+(?:\.\d+)?)%/);

						if (widthMatch) {
							const widthPercentage = parseFloat(widthMatch[1]);

							// If 95% or more, consider it watched; otherwise watching
							if (widthPercentage >= 95) {
								status.add('progress_watched');
							} else {
								status.add('progress_watching');
							}
						} else {
							// If we can't parse the percentage, fall back to watching
							status.add('progress_watching');
						}
					} else {
						// Progress div exists but no width style - assume watching
						status.add('progress_watching');
					}
				} else {
					// Resume playback renderer exists but no progress div - assume watching
					status.add('progress_watching');
				}
			} else {
				// No resume playback renderer means the video hasn't been started
				status.add('progress_unwatched');
			}
			break;
		}
	}

	return status;
}

export function includesStatus(node, status_mode, status_progress, lang) {
	return includesStatusMode(node, status_mode, lang) && includesStatusProgress(node, status_progress);
}

export function includesStatusMode(node, status, lang) {
	if (status.size === 0 || status.has('all')) {
		return true;
	} else {
		for (const s of status) {
			const node_status = classifyStatus(node, lang);
			if (node_status.has(s)) {
				return true;
			}
		}
		return false;
	}
}

export function includesStatusProgress(node, status) {
	if (status.size === 0 || status.has('progress_all')) {
		return true;
	} else {
		for (const s of status) {
			const node_status = classifyStatusProgress(node);
			if (node_status.has(s)) {
				return true;
			}
		}
		return false;
	}
}

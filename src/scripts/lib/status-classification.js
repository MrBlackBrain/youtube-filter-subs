export function classifyStatus(node, lang) {
	const status = new Set();

	switch (node.nodeName) {
		case 'YTD-GRID-VIDEO-RENDERER':
		case 'YTD-VIDEO-RENDERER':
		case 'YTD-RICH-ITEM-RENDERER':
		case 'YTD-PLAYLIST-VIDEO-RENDERER':
		case 'YT-LOCKUP-VIEW-MODEL': {
			// Check for live/streamed/scheduled content first
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
					// Check for video vs shorts classification
					classifyVideoOrShort(node, status);
				}
			} else {
				// Check for video vs shorts classification
				classifyVideoOrShort(node, status);
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
		case 'YTD-PLAYLIST-VIDEO-RENDERER':
		case 'YT-LOCKUP-VIEW-MODEL': {
			// Robust detection for YouTube's current and legacy progress UI
			let progressPercentage = 0;

			// 1) Current YouTube (2024+): segment element carries inline width: X%
			const segment = node.querySelector(
				'yt-thumbnail-overlay-progress-bar-view-model .ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment'
			);
			if (segment) {
				const widthStyle = segment.style.width || '';
				const m = widthStyle.match(/(\d+(?:\.\d+)?)%/);
				if (m) {
					progressPercentage = parseFloat(m[1]);
				} else {
					// Fallback: compute ratio of segment to its container
					const container = segment.parentElement || segment.closest('.ytThumbnailOverlayProgressBarHost');
					if (container) {
						const segW = segment.getBoundingClientRect().width;
						const contW = container.getBoundingClientRect().width;
						if (contW > 0 && segW >= 0) {
							progressPercentage = Math.max(0, Math.min(100, (segW / contW) * 100));
						}
					}
				}
			}

			// 2) Alternative selector for current YouTube layout
			if (!segment && progressPercentage === 0) {
				const altSegment = node.querySelector('.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment');
				if (altSegment) {
					const widthStyle = altSegment.style.width || '';
					const m = widthStyle.match(/(\d+(?:\.\d+)?)%/);
					if (m) {
						progressPercentage = parseFloat(m[1]);
					}
				}
			}

			// 3) Legacy YouTube structure
			if (progressPercentage === 0) {
				const legacy = node.querySelector('ytd-thumbnail-overlay-resume-playback-renderer div#progress');
				if (legacy) {
					const m = (legacy.style.width || '').match(/(\d+(?:\.\d+)?)%/);
					if (m) progressPercentage = parseFloat(m[1]);
				}
			}

			// Classify based on progress percentage
			if (progressPercentage >= 95) {
				status.add('progress_watched');
			} else if (progressPercentage > 0) {
				status.add('progress_watching');
			} else {
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

// Helper function to classify video vs shorts based on current YouTube layout
function classifyVideoOrShort(node, status) {
	// Check for shorts-specific elements first
	const shorts = node.querySelector('ytm-shorts-lockup-view-model-v2');
	if (shorts) {
		status.add('short');
		return;
	}

	// Check for slim media (shorts indicator)
	const slim_media = node.querySelector('ytd-rich-grid-slim-media');
	if (slim_media) {
		status.add('short');
		return;
	}

	// Check for shorts-specific attributes
	const shortsIndicator = node.querySelector('[is-shorts], [data-shorts], .shorts-indicator');
	if (shortsIndicator) {
		status.add('short');
		return;
	}

	// Check overlay style for shorts
	const thumbnail_overlay = node.querySelector('ytd-thumbnail-overlay-time-status-renderer');
	if (thumbnail_overlay) {
		const overlay_style = thumbnail_overlay.getAttribute('overlay-style');
		if (overlay_style === 'SHORTS') {
			status.add('short');
			return;
		}
	}

	// Check duration badge to determine if it's a short
	// Shorts typically have very short durations (under 60 seconds)
	const durationBadge = node.querySelector('badge-shape .yt-badge-shape__text');
	if (durationBadge) {
		const durationText = durationBadge.textContent?.trim();
		if (durationText) {
			// Parse duration like "3:56", "0:45", "1:23"
			const durationMatch = durationText.match(/^(\d+):(\d+)$/);
			if (durationMatch) {
				const minutes = parseInt(durationMatch[1]);
				const seconds = parseInt(durationMatch[2]);
				const totalSeconds = minutes * 60 + seconds;

				// If duration is 60 seconds or less, it's likely a short
				if (totalSeconds <= 60) {
					status.add('short');
					return;
				}
			}
		}
	}

	// Check for aspect ratio - shorts are typically 9:16 (vertical)
	const thumbnail = node.querySelector('yt-thumbnail-view-model');
	if (thumbnail) {
		// Check if it has vertical aspect ratio classes
		const hasVerticalClass =
			thumbnail.classList.contains('ytThumbnailViewModelAspectRatio9By16') ||
			thumbnail.classList.contains('ytThumbnailViewModelAspectRatioVertical');
		if (hasVerticalClass) {
			status.add('short');
			return;
		}
	}

	// Default to video if no shorts indicators found
	status.add('video');
}

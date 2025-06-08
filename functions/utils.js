export function display(value) {
	return value === true ? "" : "none";
}

export function displayAny(values) {
	for (const value of values) {
		if (value) {
			return "";
		}
	}
	return "none";
}

export function displayQuery(node, query, displayValue) {
	node.querySelectorAll(query).forEach((n) => (n.style.display = displayValue));
}

export function searchParentNode(node, nodeName) {
	for (let n = node; n; n = n.parentNode) {
		if (n.nodeName === nodeName) {
			return n;
		}
	}
	return undefined;
}

export function getPopupKey(container) {
	return `${container.parentNode.nodeName}#${container.parentNode.id}>${container.nodeName}#${container.id}`;
}

export function isMenuTarget(common) {
	return (
		common.isSubscriptions(location.href) ||
		common.isShorts(location.href) ||
		common.isLibrary(location.href) ||
		common.isHistory(location.href) ||
		common.isPlaylists(location.href) ||
		common.isPlaylist(location.href) ||
		common.isChannels(location.href) ||
		common.isChannel(location.href) ||
		common.isHashTag(location.href) ||
		common.isTop(location.href)
	);
}

export function isPositionFixedTarget(common) {
	return (
		common.isSubscriptions(location.href) ||
		common.isShorts(location.href) ||
		common.isLibrary(location.href) ||
		common.isHistory(location.href) ||
		common.isPlaylists(location.href) ||
		common.isPlaylist(location.href) ||
		common.isChannels(location.href) ||
		common.isHashTag(location.href)
	);
}

export function forTwoColumnBrowseResultsRenderer(common) {
	return common.isChannel(location.href);
}

export function forPageHeaderRenderer(common) {
	return common.isHashTag(location.href);
}

export function needSpacer(common) {
	return (
		common.isSubscriptions(location.href) ||
		common.isShorts(location.href) ||
		common.isLibrary(location.href) ||
		common.isHistory(location.href) ||
		common.isPlaylists(location.href) ||
		common.isPlaylist(location.href) ||
		common.isChannels(location.href) ||
		common.isHashTag(location.href)
	);
}

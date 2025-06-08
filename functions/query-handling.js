export function updateQueryRegex(browse, query, filterState) {
	filterState.setActiveQuery(query);
	browse.setAttribute("filter-query", query);

	const { queryList, notQueryList } = parseQuery(query);

	const regExpList = queryList.map((q) => new RegExp(q.replace(/"/g, ""), "i"));
	filterState.active.regex.set(location.href, regExpList);

	const notRegExpList = notQueryList.map((q) => new RegExp(q.replace(/"/g, ""), "i"));
	filterState.active.notRegex.set(location.href, notRegExpList);

	browse.querySelectorAll("form.filter-menu input#filter-query").forEach((e) => (e.value = query));
}

export function updatePopupQueryRegex(containers, query, filterState, getPopupKey) {
	const { queryList, notQueryList } = parseQuery(query);

	const regExpList = queryList.map((q) => new RegExp(q.replace(/"/g, ""), "i"));
	const notRegExpList = notQueryList.map((q) => new RegExp(q.replace(/"/g, ""), "i"));

	for (const container of containers) {
		const key = getPopupKey(container);
		filterState.active.regex.set(key, regExpList);
		filterState.active.notRegex.set(key, notRegExpList);
	}
}

function parseQuery(query) {
	const queryList = [];
	const notQueryList = [];
	const tokenList = query.replace(/[.*+?^=!:${}()[\]\/\\]/g, "\\$&").match(/[^\s|\-"]+|"([^"]*)"|\||\-/g);
	let nextOr = false;
	let nextNot = false;

	if (tokenList) {
		for (const token of tokenList) {
			if (token === "|") {
				nextOr = true;
			} else if (token === "-") {
				nextNot = true;
			} else {
				const t = token.replace(/\|/g, "\\|");
				if (nextOr && nextNot) {
					if (notQueryList.length - 1 >= 0) {
						notQueryList[notQueryList.length - 1] = notQueryList[notQueryList.length - 1] + "|" + t;
					} else {
						notQueryList.push(t);
					}
					nextOr = false;
					nextNot = false;
				} else if (nextOr) {
					if (queryList.length - 1 >= 0) {
						queryList[queryList.length - 1] = queryList[queryList.length - 1] + "|" + t;
					} else {
						queryList.push(t);
					}
					nextOr = false;
				} else if (nextNot) {
					notQueryList.push(t);
					nextNot = false;
				} else {
					queryList.push(t);
				}
			}
		}
	}

	return { queryList, notQueryList };
}

export function matchQuery(text, filterState) {
	return matchAllActiveRegex(text, filterState) && matchAllActiveNotRegex(text, filterState);
}

export function matchPopupQuery(container, target, filterState, getPopupKey) {
	const text =
		target.querySelector(
			"yt-formatted-string#label.ytd-playlist-add-to-option-renderer, yt-formatted-string.ytd-notification-renderer.message, yt-formatted-string.ytd-guide-entry-renderer.title"
		)?.textContent ?? "";
	return (
		matchPopupAllActiveRegex(container, text, filterState, getPopupKey) &&
		matchPopupAllActiveNotRegex(container, text, filterState, getPopupKey)
	);
}

function matchAllActiveRegex(text, filterState) {
	const rs = filterState.active.regex.get(location.href);
	if (rs) {
		for (const r of rs) {
			if (!text.match(r)) {
				return false;
			}
		}
	}
	return true;
}

function matchAllActiveNotRegex(text, filterState) {
	const rs = filterState.active.notRegex.get(location.href);
	if (rs) {
		for (const r of rs) {
			if (!!r && text.match(r)) {
				return false;
			}
		}
	}
	return true;
}

function matchPopupAllActiveRegex(container, text, filterState, getPopupKey) {
	const rs = filterState.active.regex.get(getPopupKey(container));
	if (rs) {
		for (const r of rs) {
			if (!text.match(r)) {
				return false;
			}
		}
	}
	return true;
}

function matchPopupAllActiveNotRegex(container, text, filterState, getPopupKey) {
	const rs = filterState.active.notRegex.get(getPopupKey(container));
	if (rs) {
		for (const r of rs) {
			if (!!r && text.match(r)) {
				return false;
			}
		}
	}
	return true;
}

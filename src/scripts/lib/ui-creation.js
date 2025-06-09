export function createSpacer(id) {
	const spacer = document.createElement('div');
	spacer.classList.add('filter-menu', 'spacer');
	spacer.id = id;
	return spacer;
}

export function createButton(text, mode, isShorts, browse, common, changeMode, updateVisibility, multiselection) {
	const span = document.createElement('span');
	span.style.display = 'none';
	span.classList.add('filter-button', 'filter-button-subscriptions', mode);
	span.innerHTML = text;
	span.addEventListener('click', () => {
		if (isShorts && common.isSubscriptions(location.href)) {
			location.href = 'https://www.youtube.com/feed/subscriptions/shorts';
		} else {
			changeMode(mode, multiselection, span.classList.contains('selected'), browse);
			updateVisibility(browse);
			window.scroll({ top: 0, behavior: 'instant' });
		}
	});
	return span;
}

export function createButtonChannels(text, mode, browse, changeMode, updateVisibility, multiselection) {
	const span = document.createElement('span');
	span.style.display = 'none';
	span.classList.add('filter-button', 'filter-button-channels', mode);
	span.innerHTML = text;
	span.addEventListener('click', () => {
		changeMode(mode, multiselection, span.classList.contains('selected'), browse);
		updateVisibility(browse);
		window.scroll({ top: 0, behavior: 'instant' });
	});
	return span;
}

export function createSelect(browse, changeMode, updateVisibility, multiselection) {
	const select = document.createElement('select');
	select.style.display = 'none';
	select.classList.add('filter-menu', 'filter-menu-subscriptions');
	select.addEventListener('change', () => {
		changeMode(select.value, multiselection, select.querySelector('option.selected.' + select.value), browse);
		updateVisibility(browse);
		window.scroll({ top: 0, behavior: 'instant' });
	});
	return select;
}

export function createOption(text, mode) {
	const option = document.createElement('option');
	option.classList.add('filter-button', 'filter-button-subscriptions');
	option.innerHTML = text;
	if (mode) {
		option.classList.add(mode);
		option.value = mode;
	} else {
		option.classList.add('placeholder');
		option.disabled = true;
	}
	return option;
}

export function createSelectProgress(browse, changeModeProgress, updateVisibility) {
	const select = document.createElement('select');
	select.style.display = 'none';
	select.classList.add('filter-menu', 'filter-menu-progress');
	select.addEventListener('change', () => {
		changeModeProgress(select.value, true, select.querySelector('option.selected.' + select.value), browse);
		updateVisibility(browse);
		window.scroll({ top: 0, behavior: 'instant' });
	});
	return select;
}

export function createOptionProgress(text, mode) {
	const option = document.createElement('option');
	option.classList.add('filter-button', 'filter-button-progress');
	option.innerHTML = text;
	if (mode) {
		option.classList.add(mode);
		option.value = mode;
	} else {
		option.classList.add('placeholder');
		option.disabled = true;
	}
	return option;
}

export function createQueryInputArea(input, browse, filterState, updateVisibility, updateQueryRegex) {
	const inputArea = document.createElement('span');
	inputArea.style.display = 'none';
	inputArea.classList.add('filter-query', 'area');
	inputArea.appendChild(input);
	inputArea.appendChild(createClearButton(input, browse, filterState, updateVisibility, updateQueryRegex));
	return inputArea;
}

export function createQueryInput(menu, browse, filterState) {
	const input = document.createElement('input');
	input.setAttribute('type', 'text');
	input.setAttribute('placeholder', 'Subscription Feed Filter');
	input.setAttribute(
		'title',
		'".."  PHRASE search operator.  e.g. "Phrase including spaces"\n |    OR search operator.           e.g. Phrase1 | Phrase2\n -    NOT search operator.        e.g. -Phrase\n\nNOTE: Queries that specify OR and NOT simultaneously are not supported.'
	);
	input.id = 'filter-query';
	input.value = filterState.getActiveQuery(browse);
	input.addEventListener('change', () => {
		input.blur();
		menu.requestSubmit();
	});
	return input;
}

export function createClearButton(input, browse, filterState, updateVisibility, updateQueryRegex) {
	const span = document.createElement('span');
	span.classList.add('filter-clear');
	span.innerHTML = 'Clear';
	span.addEventListener('click', () => {
		input.value = '';
		updateQueryRegex(browse, '', filterState);
		updateVisibility(browse);
		window.scroll({ top: 0, behavior: 'instant' });
	});
	return span;
}

export function createSearchButton(input, browse, filterState, updateVisibility, updateQueryRegex) {
	const span = document.createElement('span');
	span.style.display = 'none';
	span.classList.add('filter-query', 'search');
	span.innerHTML = 'Search';
	span.addEventListener('click', () => {
		updateQueryRegex(browse, input.value, filterState);
		updateVisibility(browse);
		window.scroll({ top: 0, behavior: 'instant' });
	});
	return span;
}

export function createLoadButtonContainer(common, filterState) {
	const load_button_container = document.createElement('div');
	load_button_container.classList.add('filter-button-load');
	const load_button = document.createElement('button');
	load_button.innerText = common.button_label.load;
	load_button.classList.add(
		'yt-spec-button-shape-next',
		'yt-spec-button-shape-next--tonal',
		'yt-spec-button-shape-next--mono',
		'yt-spec-button-shape-next--size-m'
	);
	load_button.addEventListener('click', () => {
		load_button_container.style.display = 'none';

		if (filterState.continuation_item) {
			filterState.continuation_item.style.display = '';
		}

		window.scroll({ top: document.body.scrollHeight, behavior: 'instant' });
	});
	load_button_container.appendChild(load_button);
	return load_button_container;
}

export function createSpinner() {
	const spinner = document.createElement('div');
	spinner.classList.add('filter-spinner');
	return spinner;
}

export function createNodeForCalc(menu) {
	const nodeForCalc = menu.cloneNode(true);
	nodeForCalc.classList.add('filter-forCalc');
	return nodeForCalc;
}

export function createQueueTopNButton(browse, common, queueHandler, queueCount, buttonText) {
	const button = document.createElement('span');
	button.classList.add('filter-button', 'filter-queue-top-n', 'queue_top_n');
	button.innerText = buttonText || `Queue Top ${queueCount}`;
	button.title = `Add the top ${queueCount} videos to your queue`;
	button.style.display = 'none';

	button.addEventListener('click', () => {
		queueHandler(browse);
	});

	return button;
}

# YouTube Filter

A powerful browser extension to filter your YouTube subscriptions feed, channel pages, playlists, and more. Take control of your viewing experience by filtering out videos based on a wide range of criteria.

This project is a fork of [yudai-tiny-developer/filter](https://github.com/yudai-tiny-developer/filter).

## Features

- **Advanced Filtering**: Apply filters on your Subscriptions feed, Channel pages, History, Playlists, search results, and the home page.
- **Filter by Video Type**:
  - Live streams
  - Past live streams (Streamed)
  - Regular videos
  - Shorts
  - Scheduled videos
- **Filter by Watched Status**:
  - Show only fully or partially watched videos.
  - Show only unwatched videos.
- **Keyword Filtering**:
  - Filter items by keywords in the title or description.
  - Use advanced search operators for precise filtering:
    - `"phrase search"` for exact phrases.
    - `word1 | word2` for OR logic.
    - `-word` to exclude items with a specific word.
- **Playlist & Channel Management**:
  - Quickly find the right playlist by filtering your list of playlists when saving a video.
  - Filter the channels list in your sidebar to easily find a specific subscription.
- **Seamless UI Integration**:
  - Adds a filter bar directly into the YouTube interface.
  - Responsive design that adapts to your window size, switching between a full bar of buttons and a compact dropdown menu.
- **Highly Customizable**:
  - Enable, disable, and reorder filter buttons from the extension's settings page.
  - Set default filters for different YouTube pages.

## How to Use

1.  After installation, navigate to a supported YouTube page (like your [Subscriptions](https://www.youtube.com/feed/subscriptions)).
2.  A new filter bar will appear at the top of the content area.
3.  **Click on the filter buttons** to toggle what you want to see. For example, click `Video` to only see regular videos, or `Live` for live streams.
4.  **Use the progress dropdown** to filter by `Watched` or `Unwatched` videos.
5.  **Use the search box** to filter by keywords. Press Enter to apply the filter.
6.  You can combine filters. For example, show only unwatched `Videos` that have "tutorial" in the title.
7.  If multi-selection is enabled in the settings, you can select multiple filter categories at once (e.g., show both `Video` and `Live`).

## Installation

### From Source (for developers)

1.  Clone this repository or download the source code as a ZIP file.
2.  Open your Chrome browser and navigate to `chrome://extensions`.
3.  Enable "Developer mode" using the toggle in the top-right corner.
4.  Click on the "Load unpacked" button.
5.  Select the directory where you cloned or unzipped the repository.
6.  The extension will now be installed and active.

## License

This project is dual-licensed under the [MIT License](LICENSE-MIT) and the [Apache 2.0 License](LICENSE-APACHE).

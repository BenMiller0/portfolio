---
name: portfolio-terminal
description: Change this portfolio's terminal commands, virtual filesystem or custom Vim editor, including keyboard input and editor rendering.
---

# Portfolio terminal

Use [README's terminal guide](../../README.md#terminal-folders) for user-facing behavior and [DESIGN's custom Vim section](../../DESIGN.md#custom-vim) for the editor contract. Paths below are relative to `app/src/`.

## Choose the implementation layer

- `windows/TerminalWindow.jsx` owns shell commands, completion, history, virtual files and the editor's read/write adapter. Keep command dispatch, completion, `HELP_ENTRIES` and manual pages consistent. Help shows only the command list; description padding is calculated from the longest label, not manually spaced per row.
- `data/projectLayout.js` supplies shared featured/More Projects grouping. `data/windowRegistry.jsx` supplies document labels and link/PDF records. Do not recreate those lists in the terminal.
- `windows/vimSession.js` owns modal editing and buffer state without browser/React dependencies. Update `VIM_HELP` when supported editing commands change; do not imply upstream Vim compatibility.
- `components/VimEditor.jsx` owns native input, focus and selection. `components/vimHighlight.jsx` renders text spans, not HTML; `assets/vim-editor.css` owns the classic terminal appearance.

## Preserve the boundaries

Virtual writes survive leaving Vim but not closing Terminal or reloading. New text files require an existing parent directory; PDFs are not editable. Never connect editor writes to host files, project source or published portfolio content without a separate user request.

Keep Escape inside Vim, including help and command entry. Insert/Replace Tab must prevent the window's focus trap from handling the event; Shift+Tab must leave the editor. Preserve native typing, paste and composition. Programmatic selection events must not overwrite a newly calculated cursor position.

The textarea, syntax layer and gutter must share font metrics, tab width and scroll offsets. Check horizontal cursor visibility as well as vertical scrolling. Keep the black editor surface in both themes; touch keys are mobile-only.

## Verify the changed behavior

- Exercise quoted paths, case-insensitive matching, relative paths, `~/`, `/`, completion and filenames containing spaces. Confirm root/More Projects placement still matches the desktop.
- For engine changes, drive `VimSession` with an in-memory adapter: test the affected operator/count/text object, undo/redo and repeat/macro behavior. Check errors leave usable state.
- In a browser, save a file with `:wq` and read it with `cat`; check unsaved `:q`, discard with `:q!`, switching buffers, and close/reopen reset. Test Escape, Tab and Shift+Tab from input, command entry and help.
- For rendering changes, inspect both themes at desktop, short-height and 320/390/768px widths; include long lines, scrolling, block cursor, syntax colors and touch controls. Check help description alignment, especially `grep` and wrapped mobile output.

Run lint/build for code changes and keep temporary checks/screenshots in `.preview.local/`. Update the root docs and command help only where the change affects them.

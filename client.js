/**
 * Client half of `dsh-umbrella-hive-theme` — the Resident Evil: The Hive theme for
 * the Harness Web UI.
 *
 * Four jobs, all registered as effects on the plugin's own context:
 *
 *   1. Stack one alias-token override layer over the active built-in theme, so
 *      the palette is live without touching the user's theme preference.
 *   2. Mount the Hive: the facility from the first Resident Evil film, drawn
 *      as a turning red hologram on its projector pad — stacked hexagonal
 *      decks on a central mast, the top platform and its spars, the sealed
 *      room cluster underneath, and a scan ring climbing through the stack.
 *   3. Render the facility artwork: the isometric Hive emblem in the sidebar
 *      and the new-session hero, and a hive-link lamp beside the account row.
 *   4. Draw a thin HUD frame over the application, plus the crimson treatment
 *      for the macOS New Session pill and the conversation tabs.
 *
 * All artwork draws with literal colors (the skill permits artwork its own
 * colors); every container, control and text token comes from the override
 * layer, so a renamed token degrades the artwork but never blank rendering.
 */
window.__ModuleLoader__.load({
  id: 'dsh-umbrella-hive-theme',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Override-layer identity. One layer per source, replaced on re-register. */
    const SOURCE = 'dsh-umbrella-hive-theme';
    /** Locale namespace for the few labels that are interface copy. */
    const NS = 'dsh-umbrella-hive-theme';

    /**
     * A single slot seats exactly one active entry and the shipped occupant
     * registers at priority 0; a negative value takes the seat without
     * disposing the shipped entry, so removing this layer hands the seat
     * straight back.
     */
    const PREEMPT = -1000;

    /* ------------------------------------------------------------- palette -- */

    const RED = '#E8112D';
    const RED_HI = '#FF4055';
    const RED_DEEP = '#5E0410';
    const INK = '#060107';
    const TEXT_1 = '#F5E9EC';
    const TEXT_2 = '#C8AEB4';
    const ERROR = '#FF4D60';

    /**
     * Every alias token the Theme provider reports as overridable, written as
     * a {dark, light} pair. The theme follows the app's Appearance setting:
     * dark is the Hive control room, light is the sealed lab version of the
     * same identity.
     */
    const T = (dark, light) => ({ dark: dark, light: light });

    const TOKENS = {
      '--dsw-alias-bg-base': T('rgba(7,1,8,0.24)', 'rgba(251,247,245,0.2)'),
      '--dsw-alias-bg-document-preview': T('#0C0209', '#FBF5F6'),
      '--dsw-alias-bg-document-selection': T(
        'color-mix(in srgb,#E8112D 28%,transparent)',
        'color-mix(in srgb,#C00A20 16%,transparent)',
      ),
      '--dsw-alias-bg-layer-1': T('#0B0209', '#FAF5F3'),
      '--dsw-alias-bg-layer-2': T('#12030E', '#F4EDEB'),
      '--dsw-alias-bg-layer-3': T('#1A0513', '#EDE2DF'),
      '--dsw-alias-bg-mask-1': T('#000000A6', '#0000003D'),
      '--dsw-alias-bg-mask-2': T('#00000066', '#0000001F'),
      '--dsw-alias-bg-mask-3': T('#0000007A', '#0000007A'),
      '--dsw-alias-bg-mask-drop': T('#12030EC0', '#FFFFFFB3'),
      '--dsw-alias-bg-mask-photo': T('#000000E0', '#000000E0'),
      '--dsw-alias-bg-module-platform': T('#1A0513', '#F6EFF0'),
      '--dsw-alias-bg-multi-select': T('#22071A', '#EADEE1'),
      '--dsw-alias-bg-overlay': T('#140410', '#FFFFFF'),
      '--dsw-alias-bg-skeleton': T('#FF405514', '#0000000A'),
      '--dsw-alias-border-inverted': T('#FFFFFF12', '#0000'),
      '--dsw-alias-border-inverted2': T('#FFFFFF1F', '#0000'),
      '--dsw-alias-border-l1': T('#E8112D26', '#C00A201F'),
      '--dsw-alias-border-l2': T('#E8112D3D', '#C00A2033'),
      '--dsw-alias-border-l2-darkmode-thin': T('#E8112D26', '#C00A201F'),
      '--dsw-alias-border-l3': T('#E8112D4D', '#C00A2047'),
      '--dsw-alias-border-l4': T('#E8112D66', '#C00A205C'),
      '--dsw-alias-brand-primary': T(RED, '#C00A20'),
      '--dsw-alias-brand-primary-invert': T('#FFFFFF', '#FFFFFF'),
      '--dsw-alias-brand-primary-new-colorprimary-new-color': T(RED, '#C00A20'),
      '--dsw-alias-brand-text': T('#FFFFFF', '#FFFFFF'),
      '--dsw-alias-button-contrast-fill': T('#F2D9DD', '#2A1218'),
      '--dsw-alias-button-elevated-fill': T('#170411', '#FFFFFF'),
      '--dsw-alias-button-floating-fill': T('#12030E', '#FFFFFF'),
      '--dsw-alias-button-floating-hover': T('#1A0512', '#F6EFF0'),
      '--dsw-alias-button-ghost-active-border': T('#7C0A1A', '#C8B3B7'),
      '--dsw-alias-button-ghost-active-fill': T('#1E0713', '#EFE3E6'),
      '--dsw-alias-button-ghost-active-hover': T('#260A18', '#E7D9DC'),
      '--dsw-alias-button-info-fill': T(RED, RED),
      '--dsw-alias-button-info-hover': T(RED_HI, '#A8071B'),
      '--dsw-alias-button-primary-dimmed': T('#4A0512', '#F3CDD4'),
      '--dsw-alias-button-primary-fill': T('var(--dsw-alias-brand-primary)', 'var(--dsw-alias-brand-primary)'),
      '--dsw-alias-button-primary-hover': T('#FF2038', '#A8071B'),
      '--dsw-alias-button-tool-bar-fill': T('#3A0C1680', '#54555780'),
      '--dsw-alias-button-tool-bar-fill-invisible': T('#1F1F1F5C', '#1F1F1F5C'),
      '--dsw-alias-button-tool-bar-hover': T('#3A0C1699', '#54555799'),
      '--dsw-alias-code-diff-added': T('var(--dsw-static-green-500-a12)', 'var(--dsw-static-green-500-a08)'),
      '--dsw-alias-code-diff-deleted': T('var(--dsw-static-red-400-a12)', 'var(--dsw-static-red-600-a08)'),
      '--dsw-alias-file-diff-added-bg': T('#15291C', '#E9F4EA'),
      '--dsw-alias-file-diff-added-gutter': T('#0F2015', '#EFF8EF'),
      '--dsw-alias-file-diff-added-marker': T('#41C977', '#01913A'),
      '--dsw-alias-file-diff-deleted-bg': T('#321317', '#FBE6E3'),
      '--dsw-alias-file-diff-deleted-gutter': T('#241014', '#FDEBE9'),
      '--dsw-alias-file-diff-deleted-marker': T('#FA4A58', '#B01F25'),
      '--dsw-alias-interactive-bg-active': T('#E8112D33', '#C00A201A'),
      '--dsw-alias-interactive-bg-hover': T('#FFFFFF14', '#2A10160F'),
      '--dsw-alias-interactive-bg-hover-accent': T('#E8112D2E', '#C00A2024'),
      '--dsw-alias-interactive-bg-hover-danger': T('#FF4D6026', '#D6141E0D'),
      '--dsw-alias-interactive-bg-hover-solid': T('#1A0512', '#EFE3E6'),
      '--dsw-alias-label-caption': T('#94797F', '#6E565D'),
      '--dsw-alias-label-deep-diving': T('color-mix(in srgb,#FF5A6B 68%,#C8AEB4)', '#B0081C'),
      '--dsw-alias-label-deep-diving-shimmer': T(
        'color-mix(in srgb,#FF6B7C 62%,transparent)',
        'color-mix(in srgb,#B0081C 55%,transparent)',
      ),
      '--dsw-alias-label-dimmed': T('#9A8086', '#8A7379'),
      '--dsw-alias-label-document-preview': T('#EBD9DD', '#4A353B'),
      '--dsw-alias-label-primary': T(TEXT_1, '#241118'),
      '--dsw-alias-label-primary-bluish': T(TEXT_1, '#241118'),
      '--dsw-alias-label-primary-dimmed': T('#D8C1C6', '#3A2027'),
      '--dsw-alias-label-primary-foreground': T('#FFFFFF', '#FFFFFF'),
      '--dsw-alias-label-primary-inverted': T('#0A0105', '#FFFFFF'),
      '--dsw-alias-label-secondary': T(TEXT_2, '#6B5058'),
      '--dsw-alias-label-shimmer': T(
        'color-mix(in srgb,#F5E9EC 45%,transparent)',
        'color-mix(in srgb,#241118 45%,transparent)',
      ),
      '--dsw-alias-label-tertiary': T('#A2888E', '#866C73'),
      '--dsw-alias-link': T('#FF4D60', '#B0081C'),
      '--dsw-alias-markdown-citation': T('#1A0611', '#F7E7EA'),
      '--dsw-alias-markdown-code-block': T('#080209', '#F8F3F4'),
      '--dsw-alias-markdown-code-block-banner': T('#12030D', '#FBF3F5'),
      '--dsw-alias-markdown-code-segment-selected': T('#1B0713', '#EEE2E5'),
      '--dsw-alias-markdown-code-segment-unselected': T('#0B020A', '#F8F3F4'),
      '--dsw-alias-markdown-inline-code': T('#170510', '#F1E6E9'),
      '--dsw-alias-markdown-placeholder': T('#12030D', '#F8F3F4'),
      '--dsw-alias-markdown-tag': T('#12030D', '#F8F3F4'),
      '--dsw-alias-menu-group-header-fill': T('#140410F0', '#FFF9FAF0'),
      '--dsw-alias-menu-icon': T('#C8A9AF', '#6B5058'),
      '--dsw-alias-scrollbar-bg-l1': T('#22091A', '#F0E3E6'),
      '--dsw-alias-scrollbar-bg-l2': T('#22091A', '#F0E3E6'),
      '--dsw-alias-scrollbar-hover-l1': T('#5E0B19', '#D9C4C8'),
      '--dsw-alias-scrollbar-hover-l2': T('#4A0512', '#E0CDD1'),
      '--dsw-alias-state-business-primary': T(RED_HI, '#C00A20'),
      '--dsw-alias-state-business-tertiary': T('#4A0512', '#F7DDE2'),
      '--dsw-alias-state-error-primary': T(ERROR, 'var(--dsw-static-red-600)'),
      '--dsw-alias-state-error-secondary': T('#FF8A95', 'var(--dsw-static-red-400)'),
      '--dsw-alias-state-idle-primary': T('#6E565D', 'var(--dsw-static-neutral-300)'),
      '--dsw-alias-state-success-primary': T('#4CCB84', '#0E7A45'),
      '--dsw-alias-state-success-secondary': T('#67D99A', 'var(--dsw-static-green-400)'),
      '--dsw-alias-state-success-tertiary': T('#0F2A1D', 'var(--dsw-static-green-100)'),
      '--dsw-alias-state-warn-label': T('#FFC078', '#8A5300'),
      '--dsw-alias-state-warn-primary': T('#F0A64B', 'var(--dsw-static-amber-500)'),
      '--dsw-alias-state-warn-secondary': T('#FFC078', 'var(--dsw-static-amber-400)'),
      '--dsw-alias-state-warn-tertiary': T('#33210A', 'var(--dsw-static-amber-100)'),
      '--dsw-alias-switch-thumb': T('#FFE1E6', '#FFFFFF'),
      '--dsw-alias-toast-bg': T('#220812', 'var(--dsw-static-neutral-bluish-800)'),
      '--dsw-alias-toast-label': T('#FFD9DE', 'var(--dsw-static-neutral-bluish-00)'),
      '--dsw-alias-tooltip-bg': T('#220812', 'var(--dsw-static-neutral-bluish-850)'),
      '--dsw-alias-tooltip-key-bg': T(
        'color-mix(in srgb, var(--dsw-alias-tooltip-bg), white 18%)',
        'color-mix(in srgb, var(--dsw-alias-tooltip-bg), white 18%)',
      ),
      '--dsw-alias-turn-trigger-bg': T('#FFFFFF14', 'var(--dsw-alias-markdown-code-block)'),
      '--dsw-alias-turn-trigger-bg-hover': T('#FFFFFF24', 'var(--dsw-alias-interactive-bg-hover)'),
      '--dsw-menu-surface-fill': T('#140410', '#FFFAF9'),
      '--dsw-specific-bubble': T('#26060F', '#F9E4E8'),
      '--dsw-specific-bubble-highlight': T('#34080F', '#F3D2D9'),
      '--dsw-specific-input-major': T('#0C0208', 'var(--dsw-static-neutral-bluish-00)'),
      '--dsw-specific-login-input': T('#080106', 'var(--dsw-static-neutral-bluish-50)'),
      '--dsw-specific-menu': T('var(--dsw-menu-surface-fill)', 'var(--dsw-menu-surface-fill)'),
      '--dsw-specific-selector': T('#170411', 'var(--dsw-static-neutral-bluish-60)'),
      '--dsw-specific-sidebar-fill': T('rgba(4,0,6,0.66)', 'var(--dsw-static-neutral-bluish-75)'),
      '--dsw-specific-sidebar-nav-item-active': T('#2A0712', 'var(--dsw-static-neutral-bluish-150)'),
      '--dsw-specific-sidebar-nav-item-active-accent': T('#E8112D2E', '#C00A2024'),
      '--dsw-specific-sidebar-nav-item-hover': T('#FFFFFF14', 'var(--dsw-static-neutral-bluish-100)'),
      '--dsw-specific-tip': T('#170411', 'var(--dsw-static-neutral-bluish-60)'),
    };

    /**
     * Shiki's css-variables theme ships its own palette on :root, outside the
     * --dsw-* registry, so code blocks are repainted here: a crimson terminal
     * ramp on dark, a warm printed-lab ramp on light. `background` and
     * `foreground` are pinned too, because the host chains them from :root and
     * custom properties substitute on the element that declares them.
     */
    const SHIKI = {
      dark: {
        '--shiki-background': '#080209',
        '--shiki-foreground': '#F3E6E9',
        '--shiki-token-comment': '#7E666C',
        '--shiki-token-constant': '#FF8A9B',
        '--shiki-token-function': '#FFD9E0',
        '--shiki-token-keyword': '#FF5A70',
        '--shiki-token-parameter': '#FFA86B',
        '--shiki-token-string': '#EFC078',
        '--shiki-token-string-expression': '#F2C88C',
        '--shiki-token-punctuation': '#B49AA0',
        '--shiki-token-link': '#FF87B0',
      },
      light: {
        '--shiki-background': '#F8F3F4',
        '--shiki-foreground': '#2A151A',
        '--shiki-token-comment': '#8A7A7E',
        '--shiki-token-constant': '#9A3B10',
        '--shiki-token-function': '#6B2C7A',
        '--shiki-token-keyword': '#A80018',
        '--shiki-token-parameter': '#A0521A',
        '--shiki-token-string': '#7A5A00',
        '--shiki-token-string-expression': '#8A5A00',
        '--shiki-token-punctuation': '#5C4A4E',
        '--shiki-token-link': '#0B5FA5',
      },
    };

    /**
     * The palette lands twice per scheme: `overrideTokens` hands the registry a
     * {light, dark} pair, and these sheets redeclare the same values so every
     * consumer resolves them wherever the host declares its own palette.
     * `!important` outranks the host's `:root`/`body` declarations.
     *
     * LIGHT takes `:root,body`; DARK takes `body[data-ds-dark-theme]` (specificity
     * 0,1,1 beats 0,0,1) and `html:has(body[data-ds-dark-theme])`, because a
     * custom property substitutes on the element that DECLARES it — a body-only
     * override left every `:root`-declared chained variable (notably Shiki's
     * code surface) on the light value.
     */
    function declarations(scheme) {
      const parts = [];
      for (const name of Object.keys(TOKENS)) {
        parts.push(name + ':' + TOKENS[name][scheme] + '!important');
      }
      const shiki = SHIKI[scheme === 'dark' ? 'dark' : 'light'];
      for (const name of Object.keys(shiki)) {
        parts.push(name + ':' + shiki[name] + '!important');
      }
      return parts.join(';');
    }

    /* The light sheet needs its own specificity bump: the host re-injects its
       own light palette whenever the appearance changes, and it lands after
       this stylesheet, so a plain `:root` loses on equal weight.
       The dark rule then has to outrank the light one on BOTH elements, or the
       light value wins on <html> while body is dark: `:root:root` is (0,2,0),
       so dark uses `:root:root:has(...)`, which carries the attribute's own
       weight and lands at (0,3,1). */
    const PALETTE_LIGHT = ':root:root,body{' + declarations('light') + '}';
    const PALETTE_DARK =
      ':root:root:has(body[data-ds-dark-theme]),body[data-ds-dark-theme]{' +
      declarations('dark') +
      '}';

    /* ------------------------------------------------------------ geometry -- */

    const hexPoints = (cx, cy, r) => {
      const points = [];
      for (let index = 0; index < 6; index += 1) {
        const angle = ((-90 + index * 60) * Math.PI) / 180;
        points.push(
          (Math.round((cx + r * Math.cos(angle)) * 10) / 10) +
            ',' +
            (Math.round((cy + r * Math.sin(angle)) * 10) / 10),
        );
      }
      return points.join(' ');
    };

    const cssNumber = (value) => String(Math.round(value * 100) / 100);

    /**
     * The Umbrella Corporation canopy: eight equal panels converging on one
     * apex, alternating red and light, each outer edge a quadratic that sags
     * inward between its corners — the canopy ripple. Drawn from geometry,
     * like every other mark in this theme.
     */
    const UMBRELLA_PANELS = (() => {
      const apexX = 150;
      const apexY = 140;
      const tip = 146;
      const scallop = 107.1;
      const at = (radius, angle) =>
        cssNumber(apexX + radius * Math.cos(angle)) +
        ' ' +
        cssNumber(apexY + radius * Math.sin(angle));
      const panels = [];
      for (let index = 0; index < 8; index += 1) {
        const from = ((-90 + index * 45) * Math.PI) / 180;
        const to = ((-90 + (index + 1) * 45) * Math.PI) / 180;
        panels.push({
          red: index % 2 === 0,
          d:
            'M' + apexX + ' ' + apexY +
            'L' + at(tip, from) +
            'Q' + at(scallop, (from + to) / 2) + ' ' + at(tip, to) +
            'Z',
        });
      }
      return panels;
    })();

    /* ----------------------------------------------------------------- css -- */

    const CSS = [
      PALETTE_LIGHT,
      PALETTE_DARK,

      /* The document canvas is the only surface no token reaches. The backdrop
         canvas paints on top of THIS root background and below #root, so the
         body itself must stay transparent: a body background paints in the
         in-flow block step, after negative-z descendants, and would cover the
         backdrop. */
      'html{color-scheme:light!important;background-color:#FBF6F6!important}',
      'html:has(body[data-ds-dark-theme]){color-scheme:dark!important;background-color:#050105!important}',
      'body{background-color:transparent!important}',
      'body[data-ds-dark-theme]{background-color:transparent!important}',

      /* --- the Hive backdrop ------------------------------------------- */
      '.hive-backdrop{position:fixed;inset:0;z-index:-1;overflow:hidden;pointer-events:none}',
      '.hive-canvas{display:block;width:100%;height:100%;opacity:1}',
      'html:has(body[data-ds-dark-theme]) .hive-canvas{opacity:1;filter:none}',

      /* --- HUD frame ---------------------------------------------------- */
      '.hive-hud{position:absolute;inset:0;overflow:hidden;pointer-events:none}',
      '.hive-corner{position:absolute;width:34px;height:34px;border:0 solid rgba(255,64,85,.42)}',
      '.hive-corner.tl{top:10px;left:10px;border-top-width:1.5px;border-left-width:1.5px}',
      '.hive-corner.tr{top:10px;right:10px;border-top-width:1.5px;border-right-width:1.5px}',
      '.hive-corner.bl{bottom:10px;left:10px;border-bottom-width:1.5px;border-left-width:1.5px}',
      '.hive-corner.br{bottom:10px;right:10px;border-bottom-width:1.5px;border-right-width:1.5px}',
      '.hive-hair{position:absolute;left:0;right:0;bottom:0;height:1px;background:linear-gradient(90deg,transparent,rgba(232,17,45,.60),transparent)}',
      '.hive-chip{position:absolute;right:20px;bottom:15px;display:flex;align-items:center;gap:8px;opacity:.72}',
      '.hive-chip-text{font-family:var(--dsw-font-family-code,ui-monospace,SFMono-Regular,Menlo,monospace);font-size:9px;font-weight:600;letter-spacing:.22em;color:var(--dsw-alias-label-secondary);white-space:nowrap}',
      '.hive-chip-name{color:var(--dsw-alias-brand-primary);letter-spacing:.26em}',
      '.hive-chip-sep{color:var(--dsw-alias-label-tertiary);opacity:.7}',
      '.hive-chip-dot{width:5px;height:5px;border-radius:50%;background:#FF4055;box-shadow:0 0 8px rgba(255,64,85,.9);animation:hive-blink 2.8s ease-in-out infinite}',

      /* --- sidebar sigil ------------------------------------------------ */
      '.hive-seat{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:0;background:none;border:0;box-shadow:none;opacity:.92;line-height:0}',
      '.hive-seat:hover{opacity:1}',
      '.hive-seat-core{animation:hive-blink 3.2s ease-in-out infinite;transform-origin:center}',
      '.hive-glyph{display:inline-flex;align-items:center;justify-content:center;line-height:0;filter:drop-shadow(0 0 7px rgba(255,56,78,.6))}',
      '.hive-glyph-scan{animation:hive-glyph-scan 4.6s ease-in-out infinite}',
      '@keyframes hive-glyph-scan{0%,100%{opacity:.16}50%{opacity:.7}}',

      /* --- hero hologram ------------------------------------------------ */
      '.hive-hero-wrap{position:relative;display:inline-flex;align-items:center;justify-content:center;line-height:0;filter:drop-shadow(0 0 16px rgba(255,56,78,.5))}',
      '.hive-hero-ring{position:absolute;inset:1%;border:1px dashed rgba(255,64,85,.42);border-radius:50%;animation:hive-spin 52s linear infinite}',
      '.hive-hero-ring-2{position:absolute;inset:9%;border:1px solid rgba(232,17,45,.22);border-radius:50%;animation:hive-spin 34s linear infinite reverse}',
      '.hive-hero-scan{position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,transparent 42%,rgba(255,100,118,.18) 50%,transparent 58%);animation:hive-scan-figure 5.6s cubic-bezier(.45,0,.55,1) infinite}',
      '@keyframes hive-scan-figure{0%{transform:translateY(-34%)}100%{transform:translateY(34%)}}',
      '@keyframes hive-spin{to{transform:rotate(360deg)}}',
      '@keyframes hive-blink{0%,100%{opacity:.35}50%{opacity:1}}',

      /* Panes that must not reveal the backdrop. The right column paints
         `bg-base`, the same token the conversation uses, so it gets its own
         opaque fill instead of a different token. */
      ':root:root{--hive-panel-solid:#FBFAF9}',
      ':root:root:has(body[data-ds-dark-theme]),body[data-ds-dark-theme]{--hive-panel-solid:#0B0209}',
      'html body [class*="_rightbarCol"],html body [class*="_rightbarCol"]>div{background-color:var(--hive-panel-solid)!important}',

      /* --- app chrome --------------------------------------------------- */
      /* macOS paints the New Session pill with a hardcoded translucent white
         literal, not a token, so no palette reaches it and its label ends up
         white on white. `button[class*=...]` keys off the stable CSS-modules
         local name. */
      '[data-platform=darwin] button[class*="newSession"]{background-color:#C00A20!important;color:#FFFFFF!important;border-color:transparent!important;box-shadow:0 1px 10px rgba(232,17,45,.35)!important}',
      '[data-platform=darwin] button[class*="newSession"]:hover{background-color:#A8071B!important;color:#FFFFFF!important;box-shadow:0 2px 16px rgba(232,17,45,.55)!important}',

      /* The sidebar foot is a column — footer actions first, the account row
         second. Flip it to a row so the hive link sits beside the account row
         instead of floating above it. Suffix matching scoped through the foot
         keeps the hit on the sidebar. */
      '[class*="_footArea"]{flex-direction:row!important;align-items:center!important;gap:8px!important}',
      '[class*="_footArea"]>[class*="_settingsArea"]{order:1!important;flex:1 1 auto!important;width:auto!important;min-width:0!important}',
      '[class*="_footArea"]>[class*="_footerActions"]{order:2!important;flex:none!important;width:auto!important}',

      /* Conversation View tabs: borderless crimson cards with one cut corner,
         no underline anywhere. White on #E8112D is 4.9:1. */
      '[data-conversation-tabs]{gap:10px!important;padding-left:0!important;margin-top:8px!important;background:transparent!important}',
      '[data-conversation-tabs] [role="tab"]{background:rgba(232,17,45,.12)!important;color:var(--dsw-alias-label-secondary)!important;border:0!important;border-radius:0!important;padding:5px 15px!important;font-weight:600!important;line-height:16px!important;clip-path:polygon(0 0,calc(100% - 9px) 0,100% 9px,100% 100%,9px 100%,0 calc(100% - 9px));transition:background-color .16s ease,color .16s ease!important}',
      '[data-conversation-tabs] [role="tab"]:after{display:none!important}',
      '[data-conversation-tabs] [role="tab"]:hover{background:rgba(232,17,45,.26)!important;color:var(--dsw-alias-label-primary)!important}',
      '[data-conversation-tabs] [role="tab"][aria-selected="true"]{background:#C00A20!important;color:#FFFFFF!important;box-shadow:0 2px 14px rgba(232,17,45,.45)!important}',
      '[data-conversation-tabs] [role="tab"][aria-selected="true"]:after{display:none!important}',

      /* Small windows: the corner chip is the first thing to go, since every
         wide horizontal decoration competes with the composer row there. */
      '@media (max-width:1120px){.hive-chip{display:none!important}}',
      '@media (prefers-reduced-motion:reduce){.hive-hero-ring,.hive-hero-ring-2,.hive-hero-scan,.hive-chip-dot,.hive-seat-core,.hive-glyph-scan{animation:none!important}}',
    ].join('');

/* -------------------------------------------------------------- hive ---- */

    /**
     * The Hive backdrop: a holographic projection of the facility from the
     * first Resident Evil film.
     *
     * The model is the film's Hive read as a schematic: a central mast carrying
     * five stacked hexagonal decks of different radii, the wide top platform
     * with its radial spars, and the sealed room cluster at the bottom. It
     * turns on a projector pad, a scan ring climbs through it, and the Red
     * Queen stands in front of it as a second hologram.
     *
     * Geometry is projected by hand: yaw about the vertical axis, a fixed
     * downward pitch, then a perspective divide. Faces are depth-sorted; each
     * deck is an annulus filled with the even-odd rule, everything else is
     * wireframe. Nothing here is a picture: it is all paths on one canvas.
     */
    const HIVE = {
      yaw: 0.00011,
      pitch: -0.22,
      camDist: 9,
      decks: [
        { y: 0.92, r: 0.44 },
        { y: 1.25, r: 0.53 },
        { y: 1.58, r: 0.63 },
        { y: 1.91, r: 0.74 },
        { y: 2.24, r: 0.85 },
        { y: 2.57, r: 0.95 },
        { y: 2.9, r: 1.03 },
        { y: 3.23, r: 1.1 },
      ],
      top: 3.5,
      shaftTop: 5.95,
      height: 6.0,
      motes: 58,
    };

    const clamp01 = (value) => (value < 0 ? 0 : value > 1 ? 1 : value);
    const smoothstep = (edge0, edge1, value) => {
      const t = clamp01((value - edge0) / (edge1 - edge0));
      return t * t * (3 - 2 * t);
    };

    /** Stable pseudo-random in [0,1) from a coordinate pair. */
    const hash2 = (x, y) => {
      const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return n - Math.floor(n);
    };

    /** Hexagon corner offsets for a flat-top cell of the given radius. */
    const hexRing = (radius, count) => {
      const points = [];
      for (let index = 0; index < count; index += 1) {
        const angle = (index / count) * Math.PI * 2;
        points.push({ x: radius * Math.cos(angle), z: radius * Math.sin(angle) });
      }
      return points;
    };

    function mountHive() {
      if (typeof document === 'undefined' || !document.body) return () => {};

      const host = document.createElement('div');
      host.className = 'hive-backdrop';
      host.setAttribute('aria-hidden', 'true');

      const canvas = document.createElement('canvas');
      canvas.className = 'hive-canvas';
      host.append(canvas);
      document.body.appendChild(host);

      const context = canvas.getContext('2d', { alpha: true });
      if (!context) {
        host.remove();
        return () => {};
      }

      const view = window;
      const media =
        typeof view.matchMedia === 'function'
          ? view.matchMedia('(prefers-reduced-motion: reduce)')
          : null;

      let width = 0;
      let height = 0;
      let dpr = 1;
      let frameId = 0;
      let lastFrame = 0;
      let visible = true;
      let reduced = media ? media.matches : false;
      const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

      const motes = [];
      for (let index = 0; index < HIVE.motes; index += 1) {
        motes.push({
          x: (hash2(index, 1) - 0.5) * 2.4,
          y: hash2(index, 2) * 2.6 - 0.1,
          z: (hash2(index, 3) - 0.5) * 2.4,
          drift: 0.00015 + hash2(index, 4) * 0.0004,
          phase: hash2(index, 5) * Math.PI * 2,
          size: 0.6 + hash2(index, 6) * 1.4,
        });
      }

      function resize() {
        width = view.innerWidth;
        height = view.innerHeight;
        dpr = Math.min(view.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.round(width * dpr));
        canvas.height = Math.max(1, Math.round(height * dpr));
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (reduced) draw(performance.now());
      }

      /** Project a model-space point into screen space. */
      function makeProjector(stageX, baseY, focal, yaw, pitch, roll) {
        const cosYaw = Math.cos(yaw);
        const sinYaw = Math.sin(yaw);
        const cosPitch = Math.cos(pitch);
        const sinPitch = Math.sin(pitch);
        /* Roll is applied in screen space about the middle of the model, which
           is what gives the shot its drone-like bank. */
        const cosRoll = Math.cos(roll || 0);
        const sinRoll = Math.sin(roll || 0);
        const pivotX = stageX;
        const pivotY = baseY * 0.58;
        return (x, y, z) => {
          const x1 = x * cosYaw - z * sinYaw;
          const z1 = x * sinYaw + z * cosYaw;
          const y1 = y * cosPitch - z1 * sinPitch;
          const z2 = y * sinPitch + z1 * cosPitch;
          const scale = focal / (HIVE.camDist + z2);
          const px = x1 * scale;
          const py = baseY - y1 * scale - pivotY;
          return {
            x: pivotX + px * cosRoll - py * sinRoll,
            y: pivotY + px * sinRoll + py * cosRoll,
            depth: z2,
            scale,
          };
        };
      }

/**
       * One frame. `now` is a millisecond timestamp; all motion is a function
       * of it, so a dropped frame changes speed by nothing.
       *
       * The facility is drawn as a solid model: every deck is a hexagonal
       * annulus with a rim wall, its faces are shaded from a fixed light and
       * sorted far-to-near, and the panel detail is part of the same sorted
       * list so nearer decks occlude it correctly. Wireframe is reserved for
       * the projector (pad rings, orbit rings, scan ring), which is a
       * projection rather than the structure.
       */
      function draw(now) {
        if (!width || !height) return;
        const time = now;
        /* Seconds since load; every motion below is a pure function of it. */
        /* Which scheme is the app painting? The host writes the attribute on
           the body, so the renderer can answer the same question its CSS does
           and lighten the room, the veil and the set dressing for the pale
           page instead of stamping a black room onto ivory. */
        const bodyEl = typeof document !== 'undefined' ? document.body : null;
        const darkScheme =
          bodyEl === null || typeof bodyEl.hasAttribute !== 'function'
            ? true
            : bodyEl.hasAttribute('data-ds-dark-theme');
        const tSec = time * 0.001;
        pointer.x += (pointer.targetX - pointer.x) * 0.05;
        pointer.y += (pointer.targetY - pointer.y) * 0.05;

        const stageX = Math.min(Math.max(width * 0.24, 420), 600) + pointer.x * 5;
        const baseY = height * 0.9 + pointer.y * 3;
        /* Dolly: the lens breathes in and out on two slow, unrelated periods,
           so the facility is now pushed back, now pulled close. */
        const dolly = 1 + Math.sin(tSec * 0.047 + 0.6) * 0.12 + Math.sin(tSec * 0.019 + 2.4) * 0.05;
        const focal = height * 0.88 * dolly;
        /* Drone-style camera. The yaw keeps advancing, but a large wobble makes
           it slow, stall and briefly drift back, so it is not one steady
           counter-clockwise orbit; the elevation sweeps through a much wider
           band than before (steep top-down to near level), and a small roll
           banks the shot. Together that reads as aerial footage circling the
           facility rather than a turntable. */
        const orbit = tSec * 0.15;
        const wobble =
          Math.sin(tSec * 0.115) * 1.15 +
          Math.sin(tSec * 0.051 + 1.7) * 0.55 +
          Math.sin(tSec * 0.023 + 4.1) * 0.3;
        const yaw = orbit + wobble + pointer.x * 0.04;
        const pitch =
          -0.3 +
          Math.sin(tSec * 0.058 + 0.8) * 0.22 +
          Math.sin(tSec * 0.021 + 3.3) * 0.06 +
          pointer.y * 0.015;
        const roll =
          Math.sin(tSec * 0.041 + 2.0) * 0.055 +
          pointer.x * 0.008;
        const project = makeProjector(stageX, baseY, focal, yaw, pitch, roll);

        const cosYaw = Math.cos(yaw);
        const sinYaw = Math.sin(yaw);
        const cosPitch = Math.cos(pitch);
        const sinPitch = Math.sin(pitch);
        const light = { x: -0.42, y: 0.82, z: -0.42 };

        /* Light in camera space, so the model reads as lit by the room rather
           than by a light glued to the turntable. */
        const shadeFace = (nx, ny, nz) => {
          const nx1 = nx * cosYaw - nz * sinYaw;
          const nz1 = nx * sinYaw + nz * cosYaw;
          const ny1 = ny * cosPitch - nz1 * sinPitch;
          const nz2 = ny * sinPitch + nz1 * cosPitch;
          const dot = nx1 * light.x + ny1 * light.y + nz2 * light.z;
          return 0.46 + 0.54 * Math.max(0, dot);
        };

        context.clearRect(0, 0, width, height);
        context.lineJoin = 'round';
        context.lineCap = 'round';

        /* Room ambience. */
        const roomGlow = context.createRadialGradient(
          stageX,
          baseY * 0.62,
          0,
          stageX,
          baseY * 0.62,
          Math.max(width, height) * 0.72,
        );
        roomGlow.addColorStop(0, darkScheme ? 'rgba(96,6,20,0.26)' : 'rgba(190,70,88,0.12)');
        roomGlow.addColorStop(0.45, darkScheme ? 'rgba(46,3,12,0.09)' : 'rgba(190,70,88,0.04)');
        roomGlow.addColorStop(1, 'rgba(6,1,7,0)');
        context.fillStyle = roomGlow;
        context.fillRect(0, 0, width, height);

        /* Perspective floor grid. */
        const horizon = height * 0.62;
        context.lineWidth = 1;
        for (let line = -14; line <= 14; line += 1) {
          const spread = line * 0.16;
          context.beginPath();
          context.moveTo(stageX + spread * width * 0.06, horizon);
          context.lineTo(stageX + spread * width * 0.9, height);
          context.strokeStyle = darkScheme ? 'rgba(232,17,45,0.04)' : 'rgba(190,70,88,0.07)';
          context.stroke();
        }
        for (let band = 1; band < 7; band += 1) {
          const t = band / 7;
          const y = horizon + Math.pow(t, 1.7) * (height - horizon) * 1.35;
          if (y > height + 4) continue;
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(width, y);
          context.strokeStyle =
            'rgba(' + (darkScheme ? '232,17,45,' : '190,70,88,') + cssNumber((darkScheme ? 0.03 : 0.06) * (1 - t)) + ')';
          context.stroke();
        }

        /* Projector: pad rings, radial ticks and the cone of light. */
        const pad = (radius, alpha, lineWidth_) => {
          const ring = hexRing(radius, 6).map((point) => project(point.x, 0, point.z));
          context.beginPath();
          ring.forEach((point, index) => {
            if (index === 0) context.moveTo(point.x, point.y);
            else context.lineTo(point.x, point.y);
          });
          context.closePath();
          context.lineWidth = lineWidth_;
          context.strokeStyle = 'rgba(255,64,85,' + cssNumber(alpha) + ')';
          context.stroke();
        };
        for (let tick = 0; tick < 48; tick += 1) {
          const angle = (tick / 48) * Math.PI * 2;
          const inner = 1.12;
          const outer = tick % 4 === 0 ? 1.26 : 1.18;
          const a = project(Math.cos(angle) * inner, 0, Math.sin(angle) * inner);
          const b = project(Math.cos(angle) * outer, 0, Math.sin(angle) * outer);
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.lineWidth = tick % 4 === 0 ? 1.4 : 0.8;
          context.strokeStyle = 'rgba(255,64,85,' + (tick % 4 === 0 ? 0.3 : 0.14) + ')';
          context.stroke();
        }
        pad(1.08, 0.5, 1.5);
        pad(1.1, 0.2, 0.9);
        pad(1.3, 0.16, 1);
        pad(1.48, 0.08, 0.8);

        const coneLow = project(0, 0, 0);
        const coneTop = project(0, 3.3, 0);
        const cone = context.createLinearGradient(coneLow.x, coneLow.y, coneTop.x, coneTop.y);
        cone.addColorStop(0, 'rgba(255,64,85,0.12)');
        cone.addColorStop(0.55, 'rgba(255,64,85,0.04)');
        cone.addColorStop(1, 'rgba(255,64,85,0)');
        context.beginPath();
        context.moveTo(project(-1.24, 0, -0.34).x, project(-1.24, 0, -0.34).y);
        context.lineTo(project(0.3, 3.3, -0.5).x, project(0.3, 3.3, -0.5).y);
        context.lineTo(project(0.5, 3.3, 0.5).x, project(0.5, 3.3, 0.5).y);
        context.lineTo(project(0.4, 0, 1.24).x, project(0.4, 0, 1.24).y);
        context.closePath();
        context.fillStyle = cone;
        context.fill();

        /* Solid geometry: build the face list, then sort and paint it. */
        const faces = [];

        const pushPoly = (points, normal, base, options) => {
          const settings = options || {};
          const projected = [];
          let depth = 0;
          for (const point of points) {
            const projectedPoint = project(point[0], point[1], point[2]);
            projected.push(projectedPoint);
            depth += projectedPoint.depth;
          }
          depth /= points.length;
          /* A bias pulls a face toward the camera for sorting only. Coplanar
             pairs — a window strip on its own wall — otherwise swap order from
             frame to frame and flicker. */
          depth += settings.bias || 0;
          /* Emissive faces — lit windows, lamps, screens — bypass the key
             light: they stay their own colour and only pick up depth fog. */
          const lit = settings.emissive
            ? 1
            : shadeFace(normal[0], normal[1], normal[2]);
          const fog = clamp01(1 - (depth + 0.7) * 0.15);
          const tint = settings.tint || 1;
          const ink = 1;
          const paper = 0;
          const mix = (value) => Math.round(value * ink + paper * (1 - ink));
          const red = mix(clamp01((base[0] * lit * fog * tint) / 255) * 255);
          const green = mix(clamp01((base[1] * lit * fog * tint) / 255) * 255);
          const blue = mix(clamp01((base[2] * lit * fog * tint) / 255) * 255);
          /* On the dark page faces are solid; on paper they are a wash with a
             drawn outline, so the facility reads as a red technical drawing
             instead of a tinted photograph. */
          /* Both schemes are solid models. On the pale page the same geometry
             is tinted toward a warm rose so the mass reads as an object rather
             than a dark slab, and the outlines stay a deeper crimson. */
          const fill = settings.alpha === undefined
            ? 'rgb(' + red + ',' + green + ',' + blue + ')'
            : 'rgba(' + red + ',' + green + ',' + blue + ',' + settings.alpha + ')';
          faces.push({
            kind: 'poly',
            points: projected,
            depth,
            fill,
            stroke: settings.stroke || null,
            lineWidth: darkScheme ? settings.lineWidth || 0 : Math.max(0.8, settings.lineWidth || 0),
          });
        };

        const pushLine = (points, stroke, lineWidth_, bias) => {
          const projected = [];
          let depth = 0;
          for (const point of points) {
            const projectedPoint = project(point[0], point[1], point[2]);
            projected.push(projectedPoint);
            depth += projectedPoint.depth;
          }
          depth /= points.length;
          faces.push({
            kind: 'line',
            points: projected,
            depth: depth + (bias || 0),
            stroke,
            lineWidth: lineWidth_,
          });
        };

        const hexCorners = (radius, y, offset) => {
          const points = [];
          for (let corner = 0; corner < 6; corner += 1) {
            const angle = (corner / 6) * Math.PI * 2 + (offset || 0);
            points.push([Math.cos(angle) * radius, y, Math.sin(angle) * radius]);
          }
          return points;
        };

        const TOP_BASE = [242, 132, 144];
        const WALL_BASE = [176, 62, 74];
        const INNER_BASE = [66, 18, 26];
        const edge = 'rgba(255,120,140,0.30)';

        /* Mast: a solid hexagonal shaft through the whole stack. It is cut
           into short segments instead of six full-height faces: one tall face
           carries a single averaged depth, so it would sort in front of decks
           that should hide it — the shaft appeared to punch through the upper
           plates. Short segments sort locally and stay behind them. */
        const MAST_R = 0.07;
        const mastSegments = 26;
        for (let segment = 0; segment < mastSegments; segment += 1) {
          const yLow = 0.02 + (6.02 - 0.02) * (segment / mastSegments);
          const yHigh = 0.02 + (6.02 - 0.02) * ((segment + 1) / mastSegments);
          for (let side = 0; side < 6; side += 1) {
            const a0 = (side / 6) * Math.PI * 2;
            const a1 = ((side + 1) / 6) * Math.PI * 2;
            pushPoly(
              [
                [Math.cos(a0) * MAST_R, yLow, Math.sin(a0) * MAST_R],
                [Math.cos(a1) * MAST_R, yLow, Math.sin(a1) * MAST_R],
                [Math.cos(a1) * MAST_R, yHigh, Math.sin(a1) * MAST_R],
                [Math.cos(a0) * MAST_R, yHigh, Math.sin(a0) * MAST_R],
              ],
              [Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)],
              [150, 58, 70],
              { stroke: 'rgba(255,140,158,0.22)', lineWidth: 0.6 },
            );
          }
        }

        /* Bottom complex: the sealed halls, towers, link corridors, vent
           stacks and satellite huts that make up the facility's base. */
        const block = (box) => {
          const halfW = box.w / 2;
          const halfD = box.d / 2;
          const x0 = box.x - halfW;
          const x1 = box.x + halfW;
          const z0 = box.z - halfD;
          const z1 = box.z + halfD;
          const y0 = box.y;
          const y1 = box.y + box.h;
          const topTone = box.top || [182, 72, 84];
          const frontTone = box.front || [160, 54, 66];
          const sideTone = box.side || [128, 40, 50];
          const backTone = box.back || [96, 28, 38];

          pushPoly([[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]], [0, 1, 0], topTone, { stroke: edge, lineWidth: 0.7 });
          pushPoly([[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]], [0, 0, -1], frontTone, { stroke: edge, lineWidth: 0.7 });
          pushPoly([[x1, y0, z0], [x1, y0, z1], [x1, y1, z1], [x1, y1, z0]], [1, 0, 0], sideTone, { stroke: edge, lineWidth: 0.7 });
          pushPoly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], [0, 0, 1], backTone, { stroke: edge, lineWidth: 0.6 });
          pushPoly([[x0, y0, z0], [x0, y0, z1], [x0, y1, z1], [x0, y1, z0]], [-1, 0, 0], backTone, { stroke: edge, lineWidth: 0.6 });

          /* Lit window strips on the front face: one band, or two for towers. */
          const bands = box.bands || [0.45];
          for (const band of bands) {
            const height = Math.min(box.h * 0.17, 0.04);
            pushPoly(
              [[x0 + 0.03, y0 + box.h * band, z0 - 0.001], [x1 - 0.03, y0 + box.h * band, z0 - 0.001],
               [x1 - 0.03, y0 + box.h * band + height, z0 - 0.001], [x0 + 0.03, y0 + box.h * band + height, z0 - 0.001]],
              [0, 0, -1],
              [255, 150, 160],
              { emissive: true, bias: -0.05 },
            );
          }
        };

        /* Foundation: a low hexagonal plinth the whole complex sits on. */
        for (let side = 0; side < 6; side += 1) {
          const a0 = (side / 6) * Math.PI * 2;
          const a1 = ((side + 1) / 6) * Math.PI * 2;
          const radius = 1.16;
          const mid = (a0 + a1) / 2;
          pushPoly(
            [
              [Math.cos(a0) * radius, 0.04, Math.sin(a0) * radius],
              [Math.cos(a1) * radius, 0.04, Math.sin(a1) * radius],
              [Math.cos(a1) * radius * 0.34, 0.04, Math.sin(a1) * radius * 0.34],
              [Math.cos(a0) * radius * 0.34, 0.04, Math.sin(a0) * radius * 0.34],
            ],
            [0, 1, 0],
            [176, 66, 78],
            { stroke: 'rgba(255,150,166,0.32)', lineWidth: 0.7 },
          );
          pushPoly(
            [
              [Math.cos(a0) * radius, 0, Math.sin(a0) * radius],
              [Math.cos(a1) * radius, 0, Math.sin(a1) * radius],
              [Math.cos(a1) * radius, 0.04, Math.sin(a1) * radius],
              [Math.cos(a0) * radius, 0.04, Math.sin(a0) * radius],
            ],
            [Math.cos(mid), 0, Math.sin(mid)],
            [128, 40, 50],
            { stroke: 'rgba(255,120,140,0.24)', lineWidth: 0.6 },
          );
        }

        const blocks = [
          /* Main halls. */
          { y: 0.14, x: -0.5, z: 0.34, w: 0.4, d: 0.2, h: 0.2, bands: [0.4, 0.72] },
          { y: 0.1, x: 0.44, z: -0.42, w: 0.42, d: 0.18, h: 0.16 },
          { y: 0.2, x: 0.14, z: 0.6, w: 0.26, d: 0.24, h: 0.28, bands: [0.3, 0.62] },
          { y: 0.06, x: -0.75, z: -0.2, w: 0.58, d: 0.1, h: 0.1 },
          /* Towers. */
          { y: 0.05, x: 0.74, z: 0.2, w: 0.19, d: 0.17, h: 0.44, bands: [0.24, 0.46, 0.68] },
          { y: 0.05, x: -0.3, z: -0.63, w: 0.25, d: 0.19, h: 0.36, bands: [0.28, 0.58, 0.84] },
          { y: 0.05, x: 0.5, z: 0.64, w: 0.16, d: 0.15, h: 0.27, bands: [0.3, 0.7] },
          { y: 0.05, x: -0.86, z: 0.42, w: 0.17, d: 0.16, h: 0.23 },
          /* Stacked second tiers. */
          { y: 0.34, x: -0.5, z: 0.34, w: 0.24, d: 0.14, h: 0.11 },
          { y: 0.26, x: 0.14, z: 0.6, w: 0.16, d: 0.16, h: 0.12 },
          { y: 0.41, x: -0.3, z: -0.63, w: 0.14, d: 0.12, h: 0.1 },
          /* Link corridors between the halls. */
          { y: 0.03, x: 0.0, z: 0.14, w: 0.74, d: 0.07, h: 0.05 },
          { y: 0.03, x: -0.18, z: -0.22, w: 0.07, d: 0.78, h: 0.05 },
          { y: 0.04, x: 0.32, z: 0.38, w: 0.52, d: 0.06, h: 0.045 },
          { y: 0.04, x: 0.52, z: -0.2, w: 0.06, d: 0.5, h: 0.045 },
        ];

        /* Ring of satellite huts around the plinth. */
        for (let hut = 0; hut < 12; hut += 1) {
          const angle = (hut / 12) * Math.PI * 2 + 0.26;
          const radius = 0.94 + (hut % 3) * 0.07;
          blocks.push({
            y: 0.02,
            x: Math.cos(angle) * radius,
            z: Math.sin(angle) * radius,
            w: 0.09 + (hut % 2) * 0.05,
            d: 0.08 + (hut % 3) * 0.02,
            h: 0.05 + (hut % 3) * 0.035,
          });
        }

        for (const box of blocks) block(box);

        /* Vent stacks with lit caps. */
        for (const vent of [
          { x: 0.6, z: -0.12 },
          { x: -0.62, z: 0.66 },
          { x: 0.04, z: -0.78 },
          { x: -0.94, z: 0.06 },
          { x: 0.34, z: 0.86 },
        ]) {
          const top = 0.3 + (Math.abs(vent.x) + Math.abs(vent.z)) * 0.08;
          block({ y: 0.02, x: vent.x, z: vent.z, w: 0.055, d: 0.055, h: top });
          pushPoly(
            [
              [vent.x - 0.045, top + 0.015, vent.z - 0.045],
              [vent.x + 0.045, top + 0.015, vent.z - 0.045],
              [vent.x + 0.045, top + 0.015, vent.z + 0.045],
              [vent.x - 0.045, top + 0.015, vent.z + 0.045],
            ],
            [0, 1, 0],
            [255, 176, 188],
            { emissive: true },
          );
        }

        /* Ring of rim lights on the plinth edge, so the base reads at scale. */
        for (let lamp = 0; lamp < 24; lamp += 1) {
          const angle = (lamp / 24) * Math.PI * 2;
          const x = Math.cos(angle) * 1.1;
          const z = Math.sin(angle) * 1.1;
          pushLine(
            [[x, 0.05, z], [x * 1.06, 0.05, z * 1.06]],
            'rgba(255,170,186,0.4)',
            0.8,
            -0.004,
          );
        }

        /* The station and its line. The cluster at the bottom is the terminus:
           a bore small enough to sit under the halls leaves the plinth, runs
           dead straight out and keeps going, so the facility reads as the end
           of a long rail approach rather than a tower with a stub. */
        const railAngle = -0.5;
        const railDir = [Math.cos(railAngle), 0, Math.sin(railAngle)];
        const railSide = [-Math.sin(railAngle), 0, Math.cos(railAngle)];
        const railStart = [railDir[0] * 1.04, 0.045, railDir[2] * 1.04];
        const railLength = 6.8;
        const railRise = 1.45;
        const halfBore = 0.052;
        const boreHeight = 0.072;
        const railSegments = 16;
        /* The bore leaves the terminus level and then climbs: height grows with
           t², so the grade is zero at the station and steepens as the line runs
           out toward the surface. */
        const railPoint = (t, lateral, height) => [
          railStart[0] + railDir[0] * railLength * t + railSide[0] * lateral,
          railStart[1] + railRise * t * t + height,
          railStart[2] + railDir[2] * railLength * t + railSide[2] * lateral,
        ];

        for (let segment = 0; segment < railSegments; segment += 1) {
          const t0 = segment / railSegments;
          const t1 = (segment + 1) / railSegments;
          pushPoly(
            [
              railPoint(t0, -halfBore, 0),
              railPoint(t0, halfBore, 0),
              railPoint(t1, halfBore, 0),
              railPoint(t1, -halfBore, 0),
            ],
            [0, 1, 0],
            [132, 42, 52],
            { stroke: 'rgba(255,120,140,0.2)', lineWidth: 0.4 },
          );
          pushPoly(
            [
              railPoint(t0, -halfBore, boreHeight),
              railPoint(t0, halfBore, boreHeight),
              railPoint(t1, halfBore, boreHeight),
              railPoint(t1, -halfBore, boreHeight),
            ],
            [0, 1, 0],
            [198, 88, 100],
            { stroke: 'rgba(255,150,166,0.26)', lineWidth: 0.4 },
          );
          for (const side of [-1, 1]) {
            pushPoly(
              [
                railPoint(t0, side * halfBore, 0),
                railPoint(t1, side * halfBore, 0),
                railPoint(t1, side * halfBore, boreHeight),
                railPoint(t0, side * halfBore, boreHeight),
              ],
              [railSide[0] * side, 0, railSide[2] * side],
              [150, 50, 62],
              { stroke: 'rgba(255,120,140,0.18)', lineWidth: 0.4 },
            );
          }
        }

        /* Rails and sleepers. */
        for (const offset of [-0.021, 0.021]) {
          pushLine(
            [railPoint(0.02, offset, 0.006), railPoint(0.99, offset, 0.006)],
            'rgba(255,206,218,0.42)',
            0.6,
            -0.006,
          );
        }
        for (let sleeper = 0; sleeper <= 44; sleeper += 1) {
          const t = 0.02 + (sleeper / 44) * 0.96;
          pushLine(
            [railPoint(t, -0.04, 0.003), railPoint(t, 0.04, 0.003)],
            'rgba(255,120,140,0.18)',
            0.4,
            -0.005,
          );
        }

        /* Portal ribs down the bore. */
        for (const t of [0.1, 0.32, 0.54, 0.76, 0.95]) {
          for (const side of [-1, 1]) {
            pushLine(
              [railPoint(t, side * (halfBore + 0.006), 0),
               railPoint(t, side * (halfBore + 0.006), boreHeight + 0.01)],
              'rgba(255,170,186,0.3)',
              0.6,
              -0.005,
            );
          }
          pushLine(
            [railPoint(t, -halfBore - 0.006, boreHeight + 0.01),
             railPoint(t, halfBore + 0.006, boreHeight + 0.01)],
            'rgba(255,170,186,0.3)',
            0.6,
            -0.005,
          );
        }

        /* Mouth: a lit frame where the line meets the plinth. */
        for (const side of [-1, 1]) {
          pushLine(
            [railPoint(0.004, side * (halfBore + 0.01), 0),
             railPoint(0.004, side * (halfBore + 0.01), boreHeight + 0.018)],
            'rgba(255,214,224,0.55)',
            0.8,
            -0.005,
          );
        }
        pushLine(
          [railPoint(0.004, -halfBore - 0.01, boreHeight + 0.018),
           railPoint(0.004, halfBore + 0.01, boreHeight + 0.018)],
          'rgba(255,214,224,0.55)',
          0.8,
          -0.005,
        );

        /* Platform: a small lit apron just in front of the mouth. */
        pushPoly(
          [
            railPoint(-0.035, -0.1, 0.004),
            railPoint(0.01, -0.09, 0.004),
            railPoint(0.01, 0.09, 0.004),
            railPoint(-0.035, 0.1, 0.004),
          ],
          [0, 1, 0],
          [204, 96, 108],
          { stroke: 'rgba(255,170,186,0.32)', lineWidth: 0.5 },
        );
        pushLine(
          [railPoint(-0.032, -0.095, 0.006), railPoint(-0.032, 0.095, 0.006)],
          'rgba(255,206,218,0.45)',
          0.8,
          -0.006,
        );

        /* A low canopy over that apron, on two thin posts. */
        pushPoly(
          [
            railPoint(-0.045, -0.1, 0.115),
            railPoint(0.02, -0.1, 0.115),
            railPoint(0.02, 0.1, 0.115),
            railPoint(-0.045, 0.1, 0.115),
          ],
          [0, 1, 0],
          [180, 72, 84],
          { stroke: 'rgba(255,160,176,0.3)', lineWidth: 0.5 },
        );
        for (const lateral of [-0.085, 0.085]) {
          pushLine(
            [railPoint(-0.04, lateral, 0.004), railPoint(-0.04, lateral, 0.115)],
            'rgba(255,160,176,0.4)',
            0.7,
            -0.004,
          );
        }

        /* Neck between the room cluster and the first deck. */
        for (let side = 0; side < 6; side += 1) {
          const a0 = (side / 6) * Math.PI * 2;
          const a1 = ((side + 1) / 6) * Math.PI * 2;
          const r = 0.2;
          pushPoly(
            [
              [Math.cos(a0) * r, 0.5, Math.sin(a0) * r],
              [Math.cos(a1) * r, 0.5, Math.sin(a1) * r],
              [Math.cos(a1) * r, 0.84, Math.sin(a1) * r],
              [Math.cos(a0) * r, 0.84, Math.sin(a0) * r],
            ],
            [Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)],
            [150, 48, 58],
            { stroke: edge, lineWidth: 0.7 },
          );
        }

        /* Decks: solid plates with rims, panel lines and honeycomb inlay. */
        for (const deck of HIVE.decks) {
          const y = deck.y;
          const r = deck.r;
          const thickness = 0.2;
          const yTop = y + thickness / 2;
          const yBottom = y - thickness / 2;
          const rInner = r * 0.34;
          const sectors = 12;

          for (let sector = 0; sector < sectors; sector += 1) {
            const a0 = (sector / sectors) * Math.PI * 2;
            const a1 = ((sector + 1) / sectors) * Math.PI * 2;
            const mid = (a0 + a1) / 2;
            const outer0 = [Math.cos(a0) * r, 0, Math.sin(a0) * r];
            const outer1 = [Math.cos(a1) * r, 0, Math.sin(a1) * r];
            const inner0 = [Math.cos(a0) * rInner, 0, Math.sin(a0) * rInner];
            const inner1 = [Math.cos(a1) * rInner, 0, Math.sin(a1) * rInner];

            pushPoly(
              [[outer0[0], yTop, outer0[2]], [outer1[0], yTop, outer1[2]], [inner1[0], yTop, inner1[2]], [inner0[0], yTop, inner0[2]]],
              [0, 1, 0],
              TOP_BASE,
              { stroke: 'rgba(255,150,166,0.22)', lineWidth: 0.7 },
            );
            /* No underside: the camera is always above the stack, and a
               horizontal face lower on the deck projects *nearer* than the top
               face, so painting it would cover the lit top. */
            pushPoly(
              [[outer0[0], yBottom, outer0[2]], [outer1[0], yBottom, outer1[2]], [outer1[0], yTop, outer1[2]], [outer0[0], yTop, outer0[2]]],
              [Math.cos(mid), 0, Math.sin(mid)],
              WALL_BASE,
              { stroke: edge, lineWidth: 0.7 },
            );
            pushPoly(
              [[inner0[0], yBottom, inner0[2]], [inner1[0], yBottom, inner1[2]], [inner1[0], yTop, inner1[2]], [inner0[0], yTop, inner0[2]]],
              [-Math.cos(mid), 0, -Math.sin(mid)],
              INNER_BASE,
              { stroke: 'rgba(255,90,110,0.16)', lineWidth: 0.6 },
            );

            /* Panel lines on the deck face. */
            pushLine(
              [[inner0[0], yTop + 0.002, inner0[2]], [outer0[0], yTop + 0.002, outer0[2]]],
              'rgba(255,120,140,0.16)',
              0.7,
              -0.002,
            );
          }

          /* Bright rim outline: the one line that makes each deck read as a
             machined plate rather than a band of colour. */
          pushLine(
            hexCorners(r, yTop + 0.002, 0),
            'rgba(255,180,195,0.55)',
            1.3,
            -0.006,
          );

          /* Two concentric inlays on the deck face. */
          for (const ring of [0.48, 0.96]) {
            pushLine(
              hexCorners(r * ring, yTop + 0.003, Math.PI / 6),
              'rgba(255,150,166,0.28)',
              0.8,
              -0.003,
            );
          }

          /* Honeycomb inlay: two rings of cells across the deck face. */
          if (r > 0.6) {
            for (const band of [{ radius: 0.52, count: 12 }, { radius: 0.82, count: 18 }]) {
              for (let cell = 0; cell < band.count; cell += 1) {
                const angle = (cell / band.count) * Math.PI * 2 + Math.PI / band.count;
                const cx = Math.cos(angle) * r * band.radius;
                const cz = Math.sin(angle) * r * band.radius;
                const cellRadius = 0.06;
                const hex = [];
                for (let corner = 0; corner < 6; corner += 1) {
                  const a = (corner / 6) * Math.PI * 2;
                  hex.push([cx + Math.cos(a) * cellRadius, yTop + 0.004, cz + Math.sin(a) * cellRadius]);
                }
                pushLine(hex.concat([hex[0]]), 'rgba(255,130,148,0.4)', 0.65, -0.004);
              }
            }
          }

          /* Rim lights: small lit cells on the outer wall. */
          for (let windowIndex = 0; windowIndex < 5; windowIndex += 1) {
            const angle = (windowIndex / 5) * Math.PI * 2 + 0.2;
            const span = 0.1;
            const w0 = angle - span / 2;
            const w1 = angle + span / 2;
            pushPoly(
              [
                [Math.cos(w0) * (r + 0.002), yBottom + 0.045, Math.sin(w0) * (r + 0.002)],
                [Math.cos(w1) * (r + 0.002), yBottom + 0.045, Math.sin(w1) * (r + 0.002)],
                [Math.cos(w1) * (r + 0.002), yTop - 0.045, Math.sin(w1) * (r + 0.002)],
                [Math.cos(w0) * (r + 0.002), yTop - 0.045, Math.sin(w0) * (r + 0.002)],
              ],
              [Math.cos(angle), 0, Math.sin(angle)],
              [255, 128, 142],
              { emissive: true, tint: 0.92, bias: -0.05 },
            );
          }

        /* The crown deck carries the facility's working level, so it gets the
           detail: a raised mezzanine around the shaft, radial catwalks out to
           the rim, equipment pods, a railing and antenna masts. */
        if (deck === HIVE.decks[HIVE.decks.length - 1]) {
          const mezzIn = 0.4;
          const mezzOut = 0.66;
          const mezzH = 0.12;
          const mezzY = yTop + mezzH;

          for (let sector = 0; sector < 12; sector += 1) {
            const a0 = (sector / 12) * Math.PI * 2;
            const a1 = ((sector + 1) / 12) * Math.PI * 2;
            const mid = (a0 + a1) / 2;
            const o0 = [Math.cos(a0) * mezzOut, Math.sin(a0) * mezzOut];
            const o1 = [Math.cos(a1) * mezzOut, Math.sin(a1) * mezzOut];
            const i0 = [Math.cos(a0) * mezzIn, Math.sin(a0) * mezzIn];
            const i1 = [Math.cos(a1) * mezzIn, Math.sin(a1) * mezzIn];
            pushPoly(
              [[o0[0], mezzY, o0[1]], [o1[0], mezzY, o1[1]], [i1[0], mezzY, i1[1]], [i0[0], mezzY, i0[1]]],
              [0, 1, 0],
              [214, 100, 112],
              { stroke: 'rgba(255,160,176,0.3)', lineWidth: 0.7 },
            );
            pushPoly(
              [[o0[0], yTop, o0[1]], [o1[0], yTop, o1[1]], [o1[0], mezzY, o1[1]], [o0[0], mezzY, o0[1]]],
              [Math.cos(mid), 0, Math.sin(mid)],
              [150, 52, 62],
              { stroke: edge, lineWidth: 0.6 },
            );
          }
          pushLine(hexCorners(mezzOut, mezzY + 0.003, 0), 'rgba(255,196,210,0.6)', 1.1, -0.006);

          for (let walk = 0; walk < 6; walk += 1) {
            const angle = (walk / 6) * Math.PI * 2 + Math.PI / 6;
            const dx = Math.cos(angle);
            const dz = Math.sin(angle);
            const half = 0.045;
            const from = 0.64;
            const to = 1.06;
            const wy = yTop + 0.02;
            const side = [-Math.sin(angle), Math.cos(angle)];
            const quad = (radius, lateral, height) => [
              dx * radius + side[0] * lateral,
              height,
              dz * radius + side[1] * lateral,
            ];
            pushPoly(
              [quad(from, -half, wy), quad(to, -half, wy), quad(to, half, wy), quad(from, half, wy)],
              [0, 1, 0],
              [196, 84, 96],
              { stroke: 'rgba(255,150,166,0.28)', lineWidth: 0.6 },
            );
            pushPoly(
              [quad(from + 0.02, -0.012, wy + 0.002), quad(to - 0.02, -0.012, wy + 0.002),
               quad(to - 0.02, 0.012, wy + 0.002), quad(from + 0.02, 0.012, wy + 0.002)],
              [0, 1, 0],
              [255, 168, 182],
              { emissive: true, tint: 0.85 },
            );
            for (const lateral of [-half, half]) {
              pushLine(
                [quad(from, lateral, wy + 0.05), quad(to, lateral, wy + 0.05)],
                'rgba(255,150,166,0.4)',
                0.8,
                -0.004,
              );
            }
          }

          for (let pod = 0; pod < 8; pod += 1) {
            const angle = (pod / 8) * Math.PI * 2 + 0.35;
            const radius = 0.82;
            const size = 0.1 + (pod % 3) * 0.025;
            block({
              y: yTop,
              x: Math.cos(angle) * radius,
              z: Math.sin(angle) * radius,
              w: size,
              d: size * 0.8,
              h: 0.07 + (pod % 2) * 0.04,
              bands: [0.4, 0.7],
            });
          }

          for (let post = 0; post < 24; post += 1) {
            const angle = (post / 24) * Math.PI * 2;
            const px = Math.cos(angle) * 1.085;
            const pz = Math.sin(angle) * 1.085;
            pushLine([[px, yTop, pz], [px, yTop + 0.085, pz]], 'rgba(255,150,166,0.45)', 0.9, -0.004);
          }
          pushLine(hexCorners(1.085, yTop + 0.085, 0), 'rgba(255,180,196,0.5)', 1, -0.005);

          for (let mast = 0; mast < 4; mast += 1) {
            const angle = (mast / 4) * Math.PI * 2 + Math.PI / 4;
            const mx = Math.cos(angle) * 0.94;
            const mz = Math.sin(angle) * 0.94;
            const mastH = 0.3 + (mast % 2) * 0.16;
            block({ y: yTop, x: mx, z: mz, w: 0.035, d: 0.035, h: mastH });
            pushPoly(
              [
                [mx - 0.03, yTop + mastH + 0.012, mz - 0.03],
                [mx + 0.03, yTop + mastH + 0.012, mz - 0.03],
                [mx + 0.03, yTop + mastH + 0.012, mz + 0.03],
                [mx - 0.03, yTop + mastH + 0.012, mz + 0.03],
              ],
              [0, 1, 0],
              [255, 196, 208],
              { emissive: true },
            );
          }

          for (let brace = 0; brace < 12; brace += 1) {
            const angle = (brace / 12) * Math.PI * 2 + Math.PI / 12;
            const inner = [Math.cos(angle) * mezzOut, mezzY - 0.02, Math.sin(angle) * mezzOut];
            const outer = [Math.cos(angle + 0.16) * 0.98, yTop + 0.01, Math.sin(angle + 0.16) * 0.98];
            pushLine([inner, outer], 'rgba(255,120,140,0.34)', 0.9, -0.008);
          }
        }

        }

        /* Top cap: the shaft's base plate, with a short rim and spars. */
        const topY = HIVE.top;
        const topR = 0.5;
        const topT = 0.14;
        for (let sector = 0; sector < 12; sector += 1) {
          const a0 = (sector / 12) * Math.PI * 2;
          const a1 = ((sector + 1) / 12) * Math.PI * 2;
          const outer0 = [Math.cos(a0) * topR, 0, Math.sin(a0) * topR];
          const outer1 = [Math.cos(a1) * topR, 0, Math.sin(a1) * topR];
          const inner0 = [Math.cos(a0) * 0.12, 0, Math.sin(a0) * 0.12];
          const inner1 = [Math.cos(a1) * 0.12, 0, Math.sin(a1) * 0.12];
          pushPoly(
            [[outer0[0], topY + topT / 2, outer0[2]], [outer1[0], topY + topT / 2, outer1[2]], [inner1[0], topY + topT / 2, inner1[2]], [inner0[0], topY + topT / 2, inner0[2]]],
            [0, 1, 0],
            TOP_BASE,
            { stroke: 'rgba(255,150,166,0.24)', lineWidth: 0.7 },
          );
          pushPoly(
            [[outer0[0], topY - topT / 2, outer0[2]], [outer1[0], topY - topT / 2, outer1[2]], [outer1[0], topY + topT / 2, outer1[2]], [outer0[0], topY + topT / 2, outer0[2]]],
            [Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)],
            WALL_BASE,
            { stroke: edge, lineWidth: 0.7 },
          );
          pushLine(
            [[inner0[0], topY + topT / 2 + 0.002, inner0[2]], [outer0[0], topY + topT / 2 + 0.002, outer0[2]]],
            'rgba(255,120,140,0.18)',
            0.7,
            -0.002,
          );
        }
        pushLine(hexCorners(topR * 0.45, topY + topT / 2 + 0.003, Math.PI / 6), 'rgba(255,150,166,0.25)', 0.8, -0.003);
        pushLine(hexCorners(topR * 0.82, topY + topT / 2 + 0.003, Math.PI / 6), 'rgba(255,150,166,0.25)', 0.8, -0.003);

        /* Short spars around the cap. */
        for (let spar = 0; spar < 6; spar += 1) {
          const angle = (spar / 6) * Math.PI * 2 + 0.2;
          const from = [Math.cos(angle) * topR, topY + 0.04, Math.sin(angle) * topR];
          const to = [Math.cos(angle) * 1.04, topY + 0.05, Math.sin(angle) * 1.04];
          pushLine([from, to], 'rgba(255,120,140,0.42)', 1.2, -0.02);
        }

        /* The long bore to the surface: a tapered six-sided shaft with
           collars, lit windows and a hatch at the top. This is the way down
           from the mansion. */
        const shaftTop = HIVE.shaftTop;
        const shaftBottomR = 0.155;
        const shaftTopR = 0.088;
        const shaftRadiusAt = (y) =>
          shaftBottomR +
          (shaftTopR - shaftBottomR) *
            clamp01((y - topY) / (shaftTop - topY));

        const shaftSegments = 16;
        for (let segment = 0; segment < shaftSegments; segment += 1) {
          const t0 = segment / shaftSegments;
          const t1 = (segment + 1) / shaftSegments;
          const y0 = topY + (shaftTop - topY) * t0;
          const y1 = topY + (shaftTop - topY) * t1;
          const r0 = shaftRadiusAt(y0);
          const r1 = shaftRadiusAt(y1);
          for (let side = 0; side < 6; side += 1) {
            const a0 = (side / 6) * Math.PI * 2;
            const a1 = ((side + 1) / 6) * Math.PI * 2;
            const mid = (a0 + a1) / 2;
            pushPoly(
              [
                [Math.cos(a0) * r0, y0, Math.sin(a0) * r0],
                [Math.cos(a1) * r0, y0, Math.sin(a1) * r0],
                [Math.cos(a1) * r1, y1, Math.sin(a1) * r1],
                [Math.cos(a0) * r1, y1, Math.sin(a0) * r1],
              ],
              [Math.cos(mid), 0, Math.sin(mid)],
              [182, 72, 84],
              { stroke: 'rgba(255,140,158,0.3)', lineWidth: 0.7 },
            );
          }
        }

        /* Collars, each a solid ring with a lit rim. */
        const collars = [3.72, 4.16, 4.6, 5.04, 5.48, 5.86];
        for (const collarY of collars) {
          const localR = shaftRadiusAt(collarY);
          const collarR = localR + 0.048;
          const collarT = 0.07;
          for (let side = 0; side < 6; side += 1) {
            const a0 = (side / 6) * Math.PI * 2;
            const a1 = ((side + 1) / 6) * Math.PI * 2;
            const mid = (a0 + a1) / 2;
            pushPoly(
              [
                [Math.cos(a0) * collarR, collarY, Math.sin(a0) * collarR],
                [Math.cos(a1) * collarR, collarY, Math.sin(a1) * collarR],
                [Math.cos(a1) * collarR, collarY + collarT, Math.sin(a1) * collarR],
                [Math.cos(a0) * collarR, collarY + collarT, Math.sin(a0) * collarR],
              ],
              [Math.cos(mid), 0, Math.sin(mid)],
              WALL_BASE,
              { stroke: edge, lineWidth: 0.6 },
            );
            pushPoly(
              [
                [Math.cos(a0) * collarR, collarY + collarT, Math.sin(a0) * collarR],
                [Math.cos(a1) * collarR, collarY + collarT, Math.sin(a1) * collarR],
                [Math.cos(a1) * localR, collarY + collarT, Math.sin(a1) * localR],
                [Math.cos(a0) * localR, collarY + collarT, Math.sin(a0) * localR],
              ],
              [0, 1, 0],
              TOP_BASE,
              { stroke: 'rgba(255,150,166,0.3)', lineWidth: 0.6 },
            );
          }
          pushLine(hexCorners(collarR, collarY + collarT + 0.003, 0), 'rgba(255,190,205,0.55)', 0.9, -0.004);
        }

        /* Lit windows along the bore, so it reads as a built passage. */
        for (const opening of [{ y: 3.7, a: 0.5 }, { y: 4.4, a: 2.5 }, { y: 5.2, a: 4.4 }]) {
          const localR = shaftRadiusAt(opening.y) + 0.002;
          const span = 0.42;
          const w0 = opening.a - span / 2;
          const w1 = opening.a + span / 2;
          pushPoly(
            [
              [Math.cos(w0) * localR, opening.y, Math.sin(w0) * localR],
              [Math.cos(w1) * localR, opening.y, Math.sin(w1) * localR],
              [Math.cos(w1) * localR, opening.y + 0.14, Math.sin(w1) * localR],
              [Math.cos(w0) * localR, opening.y + 0.14, Math.sin(w0) * localR],
            ],
            [Math.cos(opening.a), 0, Math.sin(opening.a)],
            [255, 150, 162],
            { emissive: true },
          );
        }

        /* Hatch at the surface: a wide rim around a lit floor. */
        const hatchY = shaftTop + 0.12;
        const hatchR = shaftTopR + 0.1;
        for (let side = 0; side < 6; side += 1) {
          const a0 = (side / 6) * Math.PI * 2;
          const a1 = ((side + 1) / 6) * Math.PI * 2;
          pushPoly(
            [
              [Math.cos(a0) * hatchR, shaftTop, Math.sin(a0) * hatchR],
              [Math.cos(a1) * hatchR, shaftTop, Math.sin(a1) * hatchR],
              [Math.cos(a1) * hatchR, hatchY, Math.sin(a1) * hatchR],
              [Math.cos(a0) * hatchR, hatchY, Math.sin(a0) * hatchR],
            ],
            [Math.cos((a0 + a1) / 2), 0, Math.sin((a0 + a1) / 2)],
            WALL_BASE,
            { stroke: edge, lineWidth: 0.7 },
          );
        }
        pushPoly(
          hexCorners(hatchR, hatchY, 0),
          [0, 1, 0],
          [255, 214, 222],
          { stroke: 'rgba(255,220,230,0.7)', lineWidth: 0.9 },
        );
        pushLine(hexCorners(hatchR, hatchY + 0.004, 0), 'rgba(255,226,234,0.85)', 1.6, -0.005);
        pushLine(hexCorners(hatchR * 0.55, hatchY + 0.006, 0), 'rgba(255,226,234,0.5)', 1, -0.005);

        faces.sort((a, b) => b.depth - a.depth);
        for (const face of faces) {
          if (face.points.length === 0) continue;
          context.beginPath();
          context.moveTo(face.points[0].x, face.points[0].y);
          for (let index = 1; index < face.points.length; index += 1) {
            context.lineTo(face.points[index].x, face.points[index].y);
          }
          if (face.kind === 'poly') {
            context.closePath();
            context.fillStyle = face.fill;
            context.fill();
            if (face.stroke) {
              context.strokeStyle = face.stroke;
              context.lineWidth = face.lineWidth;
              context.stroke();
            }
          } else {
            context.strokeStyle = face.stroke;
            context.lineWidth = face.lineWidth;
            context.stroke();
          }
        }

        /* Projector hologram on top of the solid model. */
        context.globalCompositeOperation = 'lighter';

        for (let ring = 0; ring < 2; ring += 1) {
          const ringRadius = 1.3 + ring * 0.22;
          const ringY = 2.95 - ring * 0.6;
          const ringSpin = yaw * (ring === 0 ? 2.2 : -1.7) + ring * 0.9;
          context.beginPath();
          for (let step = 0; step <= 56; step += 1) {
            const angle = (step / 56) * Math.PI * 2;
            const point = project(
              Math.cos(angle + ringSpin) * ringRadius,
              ringY + Math.sin(angle * 2 + ringSpin) * 0.04,
              Math.sin(angle + ringSpin) * ringRadius,
            );
            if (step === 0) context.moveTo(point.x, point.y);
            else context.lineTo(point.x, point.y);
          }
          context.setLineDash([5, 11]);
          context.strokeStyle = 'rgba(255,90,110,' + (ring === 0 ? 0.26 : 0.15) + ')';
          context.lineWidth = 1;
          context.stroke();
          context.setLineDash([]);
        }

        const scanPhase = (time * 0.00013) % 1;
        const scanY = 0.05 + scanPhase * 3.3;
        const scanRadius = 1.0 - scanPhase * 0.3;
        const scanRing = hexRing(scanRadius, 6).map((point) => project(point.x, scanY, point.z));
        context.beginPath();
        scanRing.forEach((point, index) => {
          if (index === 0) context.moveTo(point.x, point.y);
          else context.lineTo(point.x, point.y);
        });
        context.closePath();
        const scanFade = Math.sin(scanPhase * Math.PI);
        context.strokeStyle = 'rgba(255,170,180,' + cssNumber(0.2 * scanFade + 0.04) + ')';
        context.lineWidth = 1.4;
        context.stroke();

        /* Antenna beacon. */
        const beacon = project(0, HIVE.shaftTop + 0.14, 0);
        context.beginPath();
        context.arc(beacon.x, beacon.y, 2.4, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255,180,190,' + cssNumber(0.35 + 0.35 * Math.sin(time * 0.003)) + ')';
        context.fill();

        /* Dust in the projection volume. */
        for (const mote of motes) {
          mote.y -= mote.drift * 16;
          if (mote.y < -0.1) mote.y = 2.6;
          const point = project(mote.x, mote.y, mote.z);
          if (point.x < 0 || point.x > width || point.y < 0 || point.y > height) continue;
          const alpha = 0.08 + 0.2 * (1 - Math.abs(point.depth) / 1.6);
          context.beginPath();
          context.arc(point.x, point.y, Math.max(0.7, mote.size * 0.85), 0, Math.PI * 2);
          context.fillStyle = 'rgba(255,120,135,' + cssNumber(clamp01(alpha)) + ')';
          context.fill();
        }

        context.globalCompositeOperation = 'source-over';

        /* Vignette toward the working column: keeps prose crisp over the glow. */
        const veil = context.createRadialGradient(
          width * 0.64,
          height * 0.42,
          Math.min(width, height) * 0.22,
          width * 0.64,
          height * 0.42,
          Math.max(width, height) * 0.82,
        );
        veil.addColorStop(0, darkScheme ? 'rgba(3,0,4,0)' : 'rgba(252,247,247,0)');
        veil.addColorStop(0.68, darkScheme ? 'rgba(3,0,4,0.18)' : 'rgba(252,247,247,0.12)');
        veil.addColorStop(1, darkScheme ? 'rgba(3,0,4,0.42)' : 'rgba(252,247,247,0.3)');
        context.fillStyle = veil;
        context.fillRect(0, 0, width, height);

        /* Wide windows leave a whole column of empty space to the right of the
           conversation, so it gets the facility's monitoring console: three
           counter-rotating hex rings around a live core, a sweep, and a short
           readout stack. Nothing here is informational — it is set dressing,
           kept faint enough to sit under the interface. */
        if (width > 1500) {
          const panelX = width * 0.875;
          const panelY = height * 0.42;
          const panelR = Math.min(width * 0.072, 132);
          const breathe = 0.5 + 0.5 * Math.sin(tSec * 0.7);
          const inkScale = darkScheme ? 1 : 1.9;

          for (let ring = 0; ring < 3; ring += 1) {
            const ringRadius = panelR * (0.46 + ring * 0.27);
            const ringSpin = tSec * (0.14 - ring * 0.06) * (ring % 2 === 0 ? 1 : -1);
            context.beginPath();
            for (let corner = 0; corner < 6; corner += 1) {
              const angle = (corner / 6) * Math.PI * 2 + ringSpin;
              const px = panelX + Math.cos(angle) * ringRadius;
              const py = panelY + Math.sin(angle) * ringRadius;
              if (corner === 0) context.moveTo(px, py);
              else context.lineTo(px, py);
            }
            context.closePath();
            context.lineWidth = ring === 1 ? 1.4 : 1;
            context.strokeStyle =
              'rgba(232,17,45,' + cssNumber((0.2 - ring * 0.04) * inkScale) + ')';
            context.stroke();
          }

          /* Tick ring: 24 marks, every fourth one longer. */
          for (let tick = 0; tick < 24; tick += 1) {
            const angle = (tick / 24) * Math.PI * 2;
            const inner = panelR * 1.02;
            const outer = panelR * (tick % 4 === 0 ? 1.12 : 1.07);
            context.beginPath();
            context.moveTo(panelX + Math.cos(angle) * inner, panelY + Math.sin(angle) * inner);
            context.lineTo(panelX + Math.cos(angle) * outer, panelY + Math.sin(angle) * outer);
            context.lineWidth = tick % 4 === 0 ? 1.3 : 0.8;
            context.strokeStyle = 'rgba(255,64,85,' + (tick % 4 === 0 ? 0.34 : 0.19) * inkScale + ')';
            context.stroke();
          }

          /* Radar sweep: a soft wedge plus its leading edge. */
          const sweepAngle = tSec * 0.9;
          const sweepArc = 0.45;
          const sweep = context.createRadialGradient(panelX, panelY, 0, panelX, panelY, panelR);
          sweep.addColorStop(0, 'rgba(255,64,85,0.05)');
          sweep.addColorStop(1, 'rgba(255,64,85,0)');
          context.beginPath();
          context.moveTo(panelX, panelY);
          context.arc(panelX, panelY, panelR, sweepAngle - sweepArc, sweepAngle);
          context.closePath();
          context.fillStyle = sweep;
          context.fill();
          context.beginPath();
          context.moveTo(panelX, panelY);
          context.lineTo(
            panelX + Math.cos(sweepAngle) * panelR,
            panelY + Math.sin(sweepAngle) * panelR,
          );
          context.lineWidth = 1;
          context.strokeStyle = 'rgba(255,110,128,0.3)';
          context.stroke();

          /* Live core with a halo. */
          const core = context.createRadialGradient(panelX, panelY, 0, panelX, panelY, panelR * 0.3);
          core.addColorStop(0, 'rgba(255,110,128,' + cssNumber(0.16 + breathe * 0.1) + ')');
          core.addColorStop(1, 'rgba(255,110,128,0)');
          context.fillStyle = core;
          context.beginPath();
          context.arc(panelX, panelY, panelR * 0.3, 0, Math.PI * 2);
          context.fill();
          context.beginPath();
          context.arc(panelX, panelY, 2.4 + breathe * 1.6, 0, Math.PI * 2);
          context.fillStyle = 'rgba(255,140,155,' + cssNumber(0.45 + breathe * 0.25) + ')';
          context.fill();

          /* Readout stack. */
          for (let bar = 0; bar < 5; bar += 1) {
            const barY = panelY + panelR * 1.28 + bar * 11;
            const barWidth = panelR * (0.42 + 0.5 * Math.abs(Math.sin(tSec * 0.6 + bar * 1.3)));
            context.beginPath();
            context.moveTo(panelX - panelR * 0.62, barY);
            context.lineTo(panelX - panelR * 0.62 + barWidth, barY);
            context.lineWidth = 1.6;
            context.strokeStyle =
              'rgba(232,17,45,' + cssNumber((0.16 + 0.06 * Math.sin(tSec * 0.9 + bar)) * inkScale) + ')';
            context.stroke();
          }

          /* A column of idle cells, like racks waiting for a sector. */
          for (let cell = 0; cell < 7; cell += 1) {
            const cellX = panelX - panelR * 1.5;
            const cellY = panelY - panelR * 0.9 + cell * panelR * 0.3;
            const size = panelR * 0.075;
            const lit = Math.sin(tSec * 0.5 + cell * 1.7) > 0.55;
            context.beginPath();
            for (let corner = 0; corner < 6; corner += 1) {
              const angle = (corner / 6) * Math.PI * 2 + Math.PI / 6;
              const px = cellX + Math.cos(angle) * size;
              const py = cellY + Math.sin(angle) * size;
              if (corner === 0) context.moveTo(px, py);
              else context.lineTo(px, py);
            }
            context.closePath();
            context.lineWidth = 1;
            context.strokeStyle =
              'rgba(232,17,45,' + (lit ? 0.42 : 0.17) * inkScale + ')';
            context.stroke();
            if (lit) {
              context.fillStyle = 'rgba(255,96,116,0.22)';
              context.fill();
            }
          }
        }
      }

      function loop(now) {
        frameId = view.requestAnimationFrame(loop);
        if (!visible) return;
        if (now - lastFrame < 32) return;
        lastFrame = now;
        draw(now);
      }

      function onPointerMove(event) {
        pointer.targetX = (event.clientX / Math.max(1, width)) * 2 - 1;
        pointer.targetY = (event.clientY / Math.max(1, height)) * 2 - 1;
      }

      function onVisibility() {
        visible = !document.hidden;
        if (visible && !reduced) {
          lastFrame = 0;
          if (!frameId) frameId = view.requestAnimationFrame(loop);
        }
      }

      function onMotionChange() {
        reduced = media ? media.matches : false;
        if (reduced) {
          if (frameId) view.cancelAnimationFrame(frameId);
          frameId = 0;
          draw(performance.now());
        } else if (!frameId && visible) {
          lastFrame = 0;
          frameId = view.requestAnimationFrame(loop);
        }
      }

      resize();
      visible = !document.hidden;
      if (reduced) {
        draw(performance.now());
      } else {
        frameId = view.requestAnimationFrame(loop);
      }

      view.addEventListener('resize', resize);
      view.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('visibilitychange', onVisibility);
      if (media) {
        if (typeof media.addEventListener === 'function') {
          media.addEventListener('change', onMotionChange);
        } else if (typeof media.addListener === 'function') {
          media.addListener(onMotionChange);
        }
      }

      return () => {
        if (frameId) view.cancelAnimationFrame(frameId);
        frameId = 0;
        view.removeEventListener('resize', resize);
        view.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('visibilitychange', onVisibility);
        if (media) {
          if (typeof media.removeEventListener === 'function') {
            media.removeEventListener('change', onMotionChange);
          } else if (typeof media.removeListener === 'function') {
            media.removeListener(onMotionChange);
          }
        }
        host.remove();
      };
    }

/* -------------------------------------------------------------- artwork -- */

    /** The Umbrella canopy, used as the sidebar brand mark. */
    function UmbrellaMark(props) {
      const size = typeof props.size === 'number' && props.size > 0 ? props.size : 26;
      const nodes = UMBRELLA_PANELS.map((panel, index) =>
        h('path', {
          key: 'panel' + index,
          d: panel.d,
          fill: panel.red ? RED : '#F5E9EC',
          stroke: panel.red ? '#F5E9EC' : RED,
          strokeWidth: 7,
          strokeLinejoin: 'round',
        }),
      );
      nodes.push(
        h('circle', { key: 'hub', cx: 150, cy: 140, r: 13, fill: RED_DEEP, stroke: '#F5E9EC', strokeWidth: 3.5 }),
        h('circle', { key: 'core', cx: 150, cy: 140, r: 4.5, fill: RED_HI }),
      );
      return h(
        'svg',
        {
          className: 'hive-glyph',
          viewBox: '0 0 300 300',
          width: size,
          height: size,
          'aria-hidden': true,
          focusable: 'false',
          style: { display: 'block' },
        },
        nodes,
      );
    }

    /** One hexagonal plate seen from above: the Hive's decks in isometric. */
    const isoPlate = (cx, cy, halfWidth, halfHeight) => {
      const points = [
        [cx - halfWidth, cy],
        [cx - halfWidth * 0.52, cy - halfHeight],
        [cx + halfWidth * 0.52, cy - halfHeight],
        [cx + halfWidth, cy],
        [cx + halfWidth * 0.52, cy + halfHeight],
        [cx - halfWidth * 0.52, cy + halfHeight],
      ];
      return points
        .map((point) => cssNumber(point[0]) + ',' + cssNumber(point[1]))
        .join(' ');
    };

    /** Deck stack of the facility: wide in the middle, narrow at the neck. */
    const HIVE_DECKS = [
      { y: 142, w: 30, h: 7.5 },
      { y: 124, w: 40, h: 10 },
      { y: 106, w: 47, h: 11.5 },
      { y: 88, w: 42, h: 10 },
      { y: 72, w: 33, h: 7.5 },
    ];

    /**
     * The Hive emblem. `compact` is the 26 px sidebar form: solid red plates
     * and a white mast, because hairlines disappear at that size. The large
     * form is the schematic — wireframe decks, panel ticks, cell outlines and
     * a scan ring on the third deck.
     */
    function HiveGlyph(props) {
      const size = typeof props.size === 'number' && props.size > 0 ? props.size : 92;
      const compact = size < 40;

      /* The 26 px form is its own drawing, not a scaled schematic: a hex cell
         holding the facility's cross-section — four decks on a mast. Scaling
         the full drawing down turned every gap into mush. */
      if (compact) {
        const bars = [
          { y: 68, w: 26 },
          { y: 55, w: 38 },
          { y: 42, w: 44 },
          { y: 31, w: 30 },
        ];
        return h(
          'svg',
          {
            className: 'hive-glyph',
            viewBox: '0 0 100 100',
            width: size,
            height: size,
            'aria-hidden': true,
            focusable: 'false',
            style: { display: 'block' },
          },
          h('polygon', {
            key: 'cell',
            points: hexPoints(50, 52, 44),
            fill: 'rgba(26,4,14,0.95)',
            stroke: RED,
            strokeWidth: 6,
            strokeLinejoin: 'round',
          }),
          bars.map((bar, index) =>
            h('rect', {
              key: 'deck' + index,
              x: 50 - bar.w / 2,
              y: bar.y,
              width: bar.w,
              height: 6,
              rx: 1.5,
              fill: RED,
              stroke: RED_HI,
              strokeWidth: 1.2,
            }),
          ),
          h('path', {
            key: 'mast',
            d: 'M50 84 V20',
            stroke: '#F5E9EC',
            strokeWidth: 3.6,
            strokeLinecap: 'round',
          }),
          h('circle', { key: 'beacon', cx: 50, cy: 20, r: 3.6, fill: RED_HI }),
        );
      }

      const id = 'hive-glyph-d' + size;
      const plateStroke = compact ? 8 : 2.1;
      const mastStroke = compact ? 6 : 1.5;
      const nodes = [];

      nodes.push(
        h(
          'defs',
          { key: 'defs' },
          h(
            'radialGradient',
            { id: id, cx: '50%', cy: '52%', r: '54%' },
            h('stop', { offset: '0', stopColor: '#FF4055', stopOpacity: compact ? '0.34' : '0.26' }),
            h('stop', { offset: '0.6', stopColor: '#FF4055', stopOpacity: '0.07' }),
            h('stop', { offset: '1', stopColor: '#FF4055', stopOpacity: '0' }),
          ),
        ),
      );

      nodes.push(h('rect', { key: 'halo', x: 0, y: 0, width: 200, height: 200, fill: 'url(#' + id + ')' }));

      /* Bottom cluster: sealed rooms under the stack. */
      const blockStroke = compact ? 6 : 1.4;
      nodes.push(
        h('g', { key: 'base', stroke: RED, strokeOpacity: compact ? 1 : 0.5, fill: 'none', strokeWidth: blockStroke }),
        h('rect', { x: 78, y: 158, width: 15, height: 9 }),
        h('rect', { x: 96, y: 162, width: 19, height: 7 }),
        h('rect', { x: 118, y: 156, width: 11, height: 10 }),
        h('path', { d: 'M74 168 H96 M86 168 V172' }),
      );

      /* Mast. */
      nodes.push(
        h('path', {
          key: 'mast',
          d: 'M100 172 V30',
          stroke: compact ? '#F5E9EC' : 'rgba(255,120,135,0.45)',
          strokeWidth: mastStroke,
          strokeLinecap: 'round',
        }),
      );

      /* Decks, top-down so later plates overlap earlier ones. */
      HIVE_DECKS.forEach((deck, index) => {
        nodes.push(
          h('polygon', {
            key: 'deck' + index,
            points: isoPlate(100, deck.y, deck.w, deck.h),
            fill: compact ? RED : 'rgba(20,4,12,0.92)',
            stroke: compact ? RED_HI : RED,
            strokeWidth: plateStroke,
            strokeOpacity: compact ? 0.95 : 0.62,
            strokeLinejoin: 'round',
          }),
        );
        /* Plate thickness. Skipped in the compact form: at 26 px the rims
           close every gap and the stack of decks turns into one blob. */
        if (!compact) nodes.push(
          h('path', {
            key: 'rim' + index,
            d:
              'M' + (100 - deck.w) + ' ' + deck.y +
              ' L' + (100 - deck.w) + ' ' + cssNumber(deck.y + 4) +
              ' L' + (100 - deck.w * 0.52) + ' ' + cssNumber(deck.y + deck.h + 4) +
              ' L' + (100 + deck.w * 0.52) + ' ' + cssNumber(deck.y + deck.h + 4) +
              ' L' + (100 + deck.w) + ' ' + cssNumber(deck.y + 4) +
              ' L' + (100 + deck.w) + ' ' + deck.y,
            fill: 'none',
            stroke: compact ? RED_HI : RED,
            strokeOpacity: compact ? 0.5 : 0.22,
            strokeWidth: compact ? 4 : 1,
          }),
        );
        if (compact) return;
        /* Panel lines and six cell outlines per deck. */
        let ticks = '';
        for (let tick = 0; tick < 8; tick += 1) {
          const angle = (tick / 8) * Math.PI * 2 + Math.PI / 8;
          const innerX = 100 + Math.cos(angle) * deck.w * 0.66;
          const innerY = deck.y + Math.sin(angle) * deck.h * 0.66;
          const outerX = 100 + Math.cos(angle) * deck.w * 0.94;
          const outerY = deck.y + Math.sin(angle) * deck.h * 0.94;
          ticks +=
            'M' + cssNumber(innerX) + ' ' + cssNumber(innerY) +
            ' L' + cssNumber(outerX) + ' ' + cssNumber(outerY) + ' ';
        }
        nodes.push(
          h('path', {
            key: 'ticks' + index,
            d: ticks,
            stroke: RED,
            strokeOpacity: 0.26,
            strokeWidth: 0.8,
          }),
        );
        let cells = '';
        for (let cell = 0; cell < 6; cell += 1) {
          const angle = (cell / 6) * Math.PI * 2;
          const cx = 100 + Math.cos(angle) * deck.w * 0.8;
          const cy = deck.y + Math.sin(angle) * deck.h * 0.8;
          cells += isoPlate(cx, cy, 4.4, 2.2) + ' ';
        }
        nodes.push(
          h('polygon', {
            key: 'cells' + index,
            points: cells,
            fill: 'none',
            stroke: RED_HI,
            strokeOpacity: 0.4,
            strokeWidth: 0.7,
          }),
        );
      });

      /* Top platform, radial spars and antenna. */
      nodes.push(
        h('polygon', {
          key: 'top',
          points: isoPlate(100, 56, 22, 5.5),
          fill: compact ? RED : 'rgba(26,5,14,0.94)',
          stroke: compact ? RED_HI : RED,
          strokeOpacity: compact ? 0.9 : 0.6,
          strokeWidth: compact ? 7 : 1.8,
          strokeLinejoin: 'round',
        }),
      );
      let spars = '';
      for (let spar = 0; spar < 6; spar += 1) {
        const angle = (spar / 6) * Math.PI * 2 + Math.PI / 6;
        spars +=
          'M' + (100 + Math.cos(angle) * 22) + ' ' + cssNumber(56 + Math.sin(angle) * 5.5) +
          ' L' + cssNumber(100 + Math.cos(angle) * 42) + ' ' + cssNumber(58 + Math.sin(angle) * 9) + ' ';
      }
      nodes.push(
        h('path', {
          key: 'spars',
          d: spars,
          stroke: compact ? RED_HI : RED,
          strokeOpacity: compact ? 0.85 : 0.42,
          strokeWidth: compact ? 4 : 1,
        }),
      );
      nodes.push(
        h('path', {
          key: 'antenna',
          d: 'M100 56 V34',
          stroke: compact ? '#F5E9EC' : RED_HI,
          strokeOpacity: compact ? 0.9 : 0.6,
          strokeWidth: compact ? 5 : 1.2,
        }),
        h('circle', {
          key: 'beacon',
          cx: 100,
          cy: 32,
          r: compact ? 5 : 2.6,
          fill: RED_HI,
        }),
      );

      if (!compact) {
        /* Scan ring parked on the third deck. */
        nodes.push(
          h('polygon', {
            key: 'scan',
            className: 'hive-glyph-scan',
            points: isoPlate(100, 106, 54, 13.5),
            fill: 'none',
            stroke: '#FFC7CE',
            strokeOpacity: 0.55,
            strokeWidth: 1.4,
          }),
        );
      }

      return h(
        'svg',
        {
          className: 'hive-glyph',
          viewBox: '0 0 200 200',
          width: size,
          height: size,
          'aria-hidden': true,
          focusable: 'false',
          style: { display: 'block' },
        },
        nodes,
      );
    }

    function SidebarMark(props) {
      const size = typeof props.size === 'number' && props.size > 0 ? props.size : 26;
      return h(UmbrellaMark, { size: Math.round(size * 1.06) });
    }

    /**
     * The new-session hero. The host renders this seat inline with the session
     * title, so on small sizes it falls back to the solid emblem and drops the
     * hologram rings: a 24 px schematic is unreadable.
     */
    function HeroMark(props) {
      const size = typeof props.size === 'number' && props.size > 0 ? props.size : 92;
      const compact = size < 48;
      const halo = compact ? [] : [
        h('span', { key: 'ring', className: 'hive-hero-ring', 'aria-hidden': true }),
        h('span', { key: 'ring2', className: 'hive-hero-ring-2', 'aria-hidden': true }),
        h('span', { key: 'scan', className: 'hive-hero-scan', 'aria-hidden': true }),
      ];
      return h(
        'span',
        {
          className: 'hive-hero-wrap' + (compact ? ' is-compact' : ''),
          style: { width: size, height: size },
        },
        h(HiveGlyph, { size: compact ? Math.round(size * 1.1) : size }),
        halo,
      );
    }

    /** Bare hive-link lamp beside the account row: a cell with a live core. */
    function HiveLamp(props) {
      const size = typeof props.size === 'number' && props.size > 0 ? props.size : 18;
      const label = props.label || 'The Hive';
      return h(
        'span',
        { className: 'hive-seat', title: label, 'aria-label': label, role: 'img' },
        h(
          'svg',
          {
            viewBox: '0 0 40 40',
            width: size,
            height: size,
            'aria-hidden': true,
            focusable: 'false',
            style: { display: 'block' },
          },
          h('polygon', {
            points: hexPoints(20, 20, 17),
            fill: 'none',
            stroke: RED,
            strokeWidth: 2.6,
            strokeOpacity: 0.9,
            strokeLinejoin: 'round',
          }),
          h('circle', {
            className: 'hive-seat-core',
            cx: 20,
            cy: 20,
            r: 4.6,
            fill: RED_HI,
          }),
          h('circle', {
            cx: 20,
            cy: 20,
            r: 8.4,
            fill: 'none',
            stroke: RED,
            strokeWidth: 1,
            strokeOpacity: 0.35,
          }),
        ),
      );
    }

    const CORNERS = ['tl', 'tr', 'bl', 'br'];

    function HudFrame(props) {
      const t = props.t;
      const label = typeof t === 'function' ? t('hud.link') : 'HIVE LINK ACTIVE';
      return h(
        'div',
        { className: 'hive-hud', 'aria-hidden': true },
        CORNERS.map((corner) =>
          h('div', { key: corner, className: 'hive-corner ' + corner }),
        ),
        h('div', { key: 'hair', className: 'hive-hair' }),
        h(
          'div',
          { key: 'chip', className: 'hive-chip' },
          h('span', { className: 'hive-chip-dot' }),
          h('span', { className: 'hive-chip-text hive-chip-name' }, 'THE HIVE'),
          h('span', { className: 'hive-chip-text hive-chip-sep' }, '/'),
          h('span', { className: 'hive-chip-text' }, label),
        ),
      );
    }

    /* -------------------------------------------------------------- plugin -- */

    return {
      inject: ['theme', 'slots', 'locale'],
      apply(ctx) {
        ctx.effect(
          () => ctx.theme.overrideTokens(SOURCE, TOKENS),
          'the-hive palette',
        );


        ctx.effect(() => {
          const tag = document.createElement('style');
          tag.dataset.plugin = SOURCE;
          tag.textContent = CSS;
          document.head.appendChild(tag);
          return () => tag.remove();
        }, 'the-hive stylesheet');

        ctx.effect(() => ctx.locale.register(NS, {
          en: {
            'hud.link': 'HIVE LINK ACTIVE',
            'seat.label': 'The Hive — hive link active',
          },
          zh: {
            'hud.link': '蜂巢链路在线',
            'seat.label': '蜂巢 · 链路在线',
          },
        }), 'the-hive dictionary');

        const t = ctx.locale.bind(NS);

        ctx.effect(() => mountHive(), 'the-hive hive backdrop');

        ctx.slots.inject('sidebar.brand.mark', () =>
          ctx.slots.register(
            { name: 'sidebar.brand.mark', priority: PREEMPT },
            SidebarMark,
          ));

        ctx.slots.inject('conversation.hero.brand.mark', () =>
          ctx.slots.register(
            { name: 'conversation.hero.brand.mark', priority: PREEMPT },
            HeroMark,
          ));

        ctx.slots.inject('sidebar.footer.action', () =>
          ctx.slots.register(
            {
              name: 'sidebar.footer.action',
              id: 'the-hive-hive-link',
              order: 10,
              locale: NS,
              inject: () => ({ label: t('seat.label') }),
            },
            HiveLamp,
          ));

        ctx.slots.inject('shell.overlay', () =>
          ctx.slots.register(
            {
              name: 'shell.overlay',
              id: 'the-hive-hud',
              order: -10,
              locale: NS,
              inject: () => ({ t }),
            },
            HudFrame,
          ));
      },
    };
  },
});
// Copyright (c) 2014-19 Walter Bender
// Copyright (c) Yash Khandelwal, GSoC'15
// Copyright (c) 2016 Tymon Radzik
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the The GNU Affero General Public
// License as published by the Free Software Foundation; either
// version 3 of the License, or (at your option) any later version.
//
// You should have received a copy of the GNU Affero General Public
// License along with this library; if not, write to the Free Software
// Foundation, 51 Franklin Street, Suite 500 Boston, MA 02110-1335 USA
//
// Note: This code is inspired by the Python Turtle Blocks project
// (https://github.com/walterbender/turtleart), but implemented from
// scratch. -- Walter Bender, October 2014.

function Activity() {
    _THIS_IS_MUSIC_BLOCKS_ = true;
    LEADING = 0;
    _THIS_IS_TURTLE_BLOCKS_ = !_THIS_IS_MUSIC_BLOCKS_;

    var _ERRORMSGTIMEOUT_ = 15000;
    var cellSize = 55;
    var searchSuggestions = [];
    var homeButtonContainers = [];

    var that = this;

    _doFastButton = this._doFastButton;
    _doSlowButton = this._doSlowButton;
    doHardStopButton = this.doHardStopButton;
    _setupBlocksContainerEvents = this._setupBlocksContainerEvents
    getCurrentKeyCode = this.getCurrentKeyCode;
    clearCurrentKeyCode = this.clearCurrentKeyCode;
    onStopTurtle = this.onStopTurtle;
    onRunTurtle = this.onRunTurtle;
    doSave = this.doSave;
    runProject = this.runProject;
    loadProject = this.loadProject;
    loadStartWrapper = this.loadStartWrapper;
    showContents = this.showContents;
    _loadStart = this._loadStart;
    _setupAndroidToolbar = this._setupAndroidToolbar;;
    _loadButtonDragHandler = this._loadButtonDragHandler;

    scrollBlockContainer = false;
    scrollPaletteContainer = false;

    if (_THIS_IS_TURTLE_BLOCKS_) {
        function facebookInit() {
            window.fbAsyncInit = function () {
                FB.init({
                    appId: '1496189893985945',
                    xfbml: true,
                    version: 'v2.1'
                });

                // ADD ADDITIONAL FACEBOOK CODE HERE
            };
        };

        try {
            (function (d, s, id) {
                js,
                fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {
                    return;
                }

                js = d.createElement(s);
                js.id = id;
                js.src = 'https://connect.facebook.net/en_US/sdk.js';
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        } catch (e) {};
    }

    var firstTimeUser = false;
    if (_THIS_IS_MUSIC_BLOCKS_) {
        beginnerMode = true;
        try {
            if (localStorage.beginnerMode === undefined) {
                firstTimeUser = true;
                console.debug('FIRST TIME USER');
            } else if (localStorage.beginnerMode !== null) {
                beginnerMode = localStorage.beginnerMode;
                console.debug('READING BEGINNERMODE FROM LOCAL STORAGE: ' + beginnerMode + ' ' + typeof (beginnerMode));
                if (typeof (beginnerMode) === 'string') {
                    if (beginnerMode === 'false') {
                        beginnerMode = false;
                    }
                }
            }

            console.debug('BEGINNERMODE is ' + beginnerMode);
        } catch (e) {
            console.debug(e);
            console.debug('ERROR READING BEGINNER MODE');
            console.debug('BEGINNERMODE is ' + beginnerMode);
        }
    } else {
        // Turtle Blocks
        beginnerMode = false;
    }

    if (beginnerMode) {
        console.debug('BEGINNER MODE');
    } else {
        console.debug('ADVANCED MODE');
    }

    try {
        console.debug('stored preference: ' + localStorage.languagePreference);
        console.debug('browser preference: ' + navigator.language);

        if (localStorage.languagePreference !== undefined) {
            try {
                lang = localStorage.languagePreference;
                document.webL10n.setLanguage(lang);
            } catch (e) {
                console.debug(e);
            }
        } else {
            // document.webL10n.getLanguage();
            lang = navigator.language;
            if (lang.indexOf('-') !== -1) {
                lang = lang.slice(0, lang.indexOf('-'));
                document.webL10n.setLanguage(lang);
            }
        }
    } catch (e) {
        console.debug(e);
    }

    MYDEFINES = [
        'activity/sugarizer-compatibility',
        'utils/platformstyle',
        'easeljs.min',
        'tweenjs.min',
        'preloadjs.min',
        'howler',
        'p5.min',
        'p5.sound.min',
        'p5.dom.min',
        // 'mespeak',
        'Chart',
        'utils/utils',
        'activity/artwork',
        'widgets/status',
        'widgets/help',
        'utils/munsell',
        'activity/toolbar',
        'activity/trash',
        'activity/boundary',
        'activity/turtle',
        'activity/palette',
        'activity/protoblocks',
        'activity/blocks',
        'activity/block',
        'activity/turtledefs',
        'activity/logo',
        'activity/languagebox',
        'activity/basicblocks',
        'activity/blockfactory',
        'activity/rubrics',
        'activity/macros',
        'activity/SaveInterface',
        'utils/musicutils',
        'utils/synthutils',
        // 'activity/playbackbox',
        'activity/pastebox',
        'prefixfree.min'
    ];

    if (_THIS_IS_MUSIC_BLOCKS_) {
        MUSICBLOCKS_EXTRAS = [
            'Tone',
            'widgets/widgetWindows',
            'widgets/modewidget',
            'widgets/meterwidget',
            'widgets/pitchtimematrix',
            'widgets/pitchdrummatrix',
            'widgets/rhythmruler',
            'widgets/pitchstaircase',
            'widgets/temperament',
            'widgets/tempo',
            'widgets/pitchslider',
            'widgets/musickeyboard',
            'widgets/timbre',
            'activity/lilypond',
            'activity/abc',
            'activity/mxml'
        ];
        MYDEFINES = MYDEFINES.concat(MUSICBLOCKS_EXTRAS);
    }


    /*
     * Initialises major variables and renders default stack
     *
     */
    this.setupDependencies = function () {
        // blocks = new Blocks(this);
        createDefaultStack();
        createHelpContent();
        // facebookInit();
        window.scroll(0, 0);

        /*
        try {
            meSpeak.loadConfig('lib/mespeak_config.json');
             lang = document.webL10n.getLanguage();
            if (sugarizerCompatibility.isInsideSugarizer()) {
                lang = sugarizerCompatibility.getLanguage();
            }

            if (['es', 'ca', 'de', 'el', 'eo', 'fi', 'fr', 'hu', 'it', 'kn', 'la', 'lv', 'nl', 'pl', 'pt', 'ro', 'sk', 'sv', 'tr', 'zh'].indexOf(lang) !== -1) {
                meSpeak.loadVoice('lib/voices/' + lang + '.json');
            } else {
                meSpeak.loadVoice('lib/voices/en/en.json');
            }
        } catch (e) {
            console.debug(e);
        }
        */

        document.title = TITLESTRING;

        canvas = docById('myCanvas');

        // Set up a file chooser for the doOpen function.
        fileChooser = docById('myOpenFile');
        // Set up a file chooser for the doOpenPlugin function.
        pluginChooser = docById('myOpenPlugin');
        // The file chooser for all files.
        allFilesChooser = docById('myOpenAll');
        auxToolbar = docById('aux-toolbar');

        // Are we running off of a server?
        server = true;
        turtleBlocksScale = 1;
        mousestage = null;
        stage = null;
        turtles = null;
        palettes = null;
        blocks = null;
        logo = null;
        pasteBox = null;
        languageBox = null;
        planet = null;
        window.converter = null;
        storage = null;
        buttonsVisible = true;
        headerContainer = null;
        swiping = false;
        menuButtonsVisible = false;
        scrollBlockContainer = false;
        scrollPaletteContainer = false;
        currentKeyCode = 0;
        pasteContainer = null;
        pasteImage = null;
        chartBitmap = null;
        merging = false;
        loading = false;
        // On-screen buttons
        smallerContainer = null;
        largerContainer = null;
        smallerOffContainer = null;
        largerOffContainer = null;
        resizeDebounce = false;
        hideBlocksContainer = null;
        collapseBlocksContainer = null;

        searchWidget = docById('search');
        searchWidget.style.visibility = 'hidden';

        progressBar = docById('myProgress');
        progressBar.style.visibility = 'hidden';

        new createjs.DOMElement(docById('paste'));
        paste = docById('paste');
        paste.style.visibility = 'hidden';

        closeContextWheel = function () {
            // docById('contextWheelDiv').style.display = 'none';
        };

        toolbarHeight = document.getElementById('toolbars').offsetHeight;
    }

    /*
     * Sets up right click functionality opening the context menus
     * (if block is right clicked)
     */
    this.doContextMenus = function () {
        document.addEventListener("contextmenu", function (event) {
            event.preventDefault();
            event.stopPropagation();
        }, false);
    };

    /*
     * Sets up plugin and palette boiler plate
     */
    this.doPluginsAndPaletteCols = function () {
        // Calculate the palette colors.
        /*
        for ( p in PALETTECOLORS) {
            PALETTEFILLCOLORS[p] = getMunsellColor(PALETTECOLORS[p][0], PALETTECOLORS[p][1], PALETTECOLORS[p][2]);
            PALETTESTROKECOLORS[p] = getMunsellColor(PALETTECOLORS[p][0], PALETTECOLORS[p][1] - 30, PALETTECOLORS[p][2]);
            PALETTEHIGHLIGHTCOLORS[p] = getMunsellColor(PALETTECOLORS[p][0], PALETTECOLORS[p][1] + 10, PALETTECOLORS[p][2]);
            HIGHLIGHTSTROKECOLORS[p] = getMunsellColor(PALETTECOLORS[p][0], PALETTECOLORS[p][1] - 50, PALETTECOLORS[p][2]);
        }
        */

        for (p in platformColor.paletteColors) {
            PALETTEFILLCOLORS[p] = platformColor.paletteColors[p][0];
            PALETTESTROKECOLORS[p] = platformColor.paletteColors[p][1];
            PALETTEHIGHLIGHTCOLORS[p] = platformColor.paletteColors[p][2];
            HIGHLIGHTSTROKECOLORS[p] = platformColor.paletteColors[p][1];
        };

        pluginObjs = {
            'PALETTEPLUGINS': {},
            'PALETTEFILLCOLORS': {},
            'PALETTESTROKECOLORS': {},
            'PALETTEHIGHLIGHTCOLORS': {},
            'FLOWPLUGINS': {},
            'ARGPLUGINS': {},
            'BLOCKPLUGINS': {},
            'MACROPLUGINS': {},
            'ONLOAD': {},
            'ONSTART': {},
            'ONSTOP': {}
        };

        // Stacks of blocks saved in local storage
        macroDict = {};

        cameraID = null;

        // default values
        const DEFAULTDELAY = 500; // milleseconds
        const TURTLESTEP = -1; // Run in step-by-step mode

        BLOCKSCALES = [1, 1.5, 2, 3, 4];
        blockscale = BLOCKSCALES.indexOf(DEFAULTBLOCKSCALE);
        if (blockscale === -1) {
            blockscale = 1;
        }

        // Used to track mouse state for mouse button block
        stageMouseDown = false;
        stageX = 0;
        stageY = 0;

        onXO = (screen.width === 1200 && screen.height === 900) || (screen.width === 900 && screen.height === 1200);

        cellSize = 55;
        if (onXO) {
            cellSize = 75;
        }

        onscreenButtons = [];
        onscreenMenu = [];

        firstRun = true;

        pluginsImages = {};

    }

    window.onblur = function () {
        that.doHardStopButton(true);
    };

    /*
     * Recenters blocks by finding their position on the screen
     * and moving them accordingly
     */
    _findBlocks = function () {
        // _showHideAuxMenu(false);
        if (!blocks.visible)  {
            _changeBlockVisibility();
        }
        var leftpos = Math.floor(canvas.width / 4);
        var toppos;
        blocks.activeBlock = null;
        hideDOMLabel();
        logo.showBlocks();
        blocksContainer.x = 0;
        blocksContainer.y = 0;


        if (auxToolbar.style.display === 'block') {
            toppos = 90 + toolbarHeight;
        } else {
            toppos = 90;
        }

        palettes.updatePalettes();
        var x = Math.floor(leftpos * turtleBlocksScale);
        var y = Math.floor(toppos * turtleBlocksScale);
        var even = true;

        // First start blocks
        for (var blk in blocks.blockList) {
            if (!blocks.blockList[blk].trash) {
                var myBlock = blocks.blockList[blk];
                if (myBlock.name !== 'start') {
                    continue;
                };

                if (myBlock.connections[0] == null) {
                    var dx = x - myBlock.container.x;
                    var dy = y - myBlock.container.y;
                    blocks.moveBlockRelative(blk, dx, dy);
                    blocks.findDragGroup(blk);
                    if (blocks.dragGroup.length > 0) {
                        for (var b = 0; b < blocks.dragGroup.length; b++) {
                            var bblk = blocks.dragGroup[b];
                            if (b !== 0) {
                                blocks.moveBlockRelative(bblk, dx, dy);
                            }
                        }
                    }

                    x += Math.floor(150 * turtleBlocksScale);
                    if (x > (canvas.width * 7 / 8) / (turtleBlocksScale)) {
                        even = !even;
                        if (even) {
                            x = Math.floor(leftpos);
                        } else {
                            x = Math.floor(leftpos + STANDARDBLOCKHEIGHT);
                        }

                        y += STANDARDBLOCKHEIGHT;
                    }
                }
            }
        }

        // The everything else
        for (var blk in blocks.blockList) {
            if (!blocks.blockList[blk].trash) {
                var myBlock = blocks.blockList[blk];
                if (myBlock.name === 'start') {
                    continue;
                };

                if (myBlock.connections[0] == null) {
                    var dx = x - myBlock.container.x;
                    var dy = y - myBlock.container.y;
                    blocks.moveBlockRelative(blk, dx, dy);
                    blocks.findDragGroup(blk);
                    if (blocks.dragGroup.length > 0) {
                        for (var b = 0; b < blocks.dragGroup.length; b++) {
                            var bblk = blocks.dragGroup[b];
                            if (b !== 0) {
                                blocks.moveBlockRelative(bblk, dx, dy);
                            }
                        }
                    }
                    x += 150 * turtleBlocksScale;
                    if (x > (canvas.width * 7 / 8) / (turtleBlocksScale)) {
                        even = !even;
                        if (even) {
                            x = Math.floor(leftpos);
                        } else {
                            x = Math.floor(leftpos + STANDARDBLOCKHEIGHT);
                        }

                        y += STANDARDBLOCKHEIGHT;
                    }
                }
            }
        }

        // Blocks are all home, so reset go-home-button.
        setHomeContainers(false, true);
        boundary.hide();

        // Return mice to the center of the screen.
        for (var turtle = 0; turtle < turtles.turtleList.length; turtle++) {
            console.debug('bringing turtle ' + turtle + 'home');
            var savedPenState = turtles.turtleList[turtle].penState;
            turtles.turtleList[turtle].penState = false;
            turtles.turtleList[turtle].doSetXY(0, 0);
            turtles.turtleList[turtle].doSetHeading(0);
            turtles.turtleList[turtle].penState = savedPenState;
        }
    };

    /*
     * @param zero {hides container}
     * @param one {shows container}
     */
    setHomeContainers = function (zero, one) {
        if (homeButtonContainers[0] === null) {
            return;
        }

        homeButtonContainers[0].visible = zero;
        homeButtonContainers[1].visible = one;
    };


    __saveHelpBlock = function (name, delay) {
        // Save the artwork for an individual help block.
        // (1) clear the block list
        // (2) generate the help blocks
        // (3) save the blocks as svg
        setTimeout(function () {
            sendAllToTrash(false, true);
            setTimeout(function () {
                if (BLOCKHELP[name].length < 4) {
                    // If there is nothing specified, just
                    // load the block.
                    console.debug('CLICK: ' + name);
                    var obj = blocks.palettes.getProtoNameAndPalette
(name);
                    var protoblk = obj[0];
                    var paletteName = obj[1];
                    var protoName = obj[2];

                    var protoResult = blocks.protoBlockDict.hasOwnProperty(protoName);
                    if (protoResult) {
                        blocks.palettes.dict[paletteName].makeBlockFromSearch(protoblk, protoName, function (newBlock) {
                            blocks.moveBlock(newBlock, 0, 0);
                        });
                    }
                } else if (typeof(BLOCKHELP[name][3]) === 'string') {
                    // If it is a string, load the macro
                    // assocuated with this block
                    var blocksToLoad = getMacroExpansion(BLOCKHELP[name][3], 0, 0);
                    console.debug('CLICK: ' + blocksToLoad);
                    blocks.loadNewBlocks(blocksToLoad);
                } else {
                    // Load the blocks.
                    var blocksToLoad = BLOCKHELP[name][3];
                    console.debug('CLICK: ' + blocksToLoad);
                    blocks.loadNewBlocks(blocksToLoad);
                }

                setTimeout(function () {
                    // save.saveBlockArtwork(BLOCKHELP[name][3]);
                    save.saveBlockArtwork(name + '_block.svg');
                }, 500);

            }, 500);
        }, delay + 1000);
    };

    _saveHelpBlocks = function () {
        // Save the artwork for every help block.
        var i = 0;
        for (var name in BLOCKHELP) {
            console.debug(name);
            __saveHelpBlock(name, i * 2000);
            i += 1;
        }

        sendAllToTrash(true, true);
    };

    /*
     * @return {SVG} returns SVG of blocks
     */
    _printBlockSVG = function () {
        blocks.activeBlock = null;
        var startCounter = 0;
        var svg = '';
        var xMax = 0;
        var yMax = 0;
        for (var i = 0; i < blocks.blockList.length; i++) {
            if (blocks.blockList[i].ignore()) {
                continue;
            }

            if (blocks.blockList[i].container.x + blocks.blockList[i].width > xMax) {
                xMax = blocks.blockList[i].container.x + blocks.blockList[i].width;
            }

            if (blocks.blockList[i].container.y + blocks.blockList[i].height > yMax) {
                yMax = blocks.blockList[i].container.y + blocks.blockList[i].height;
            }

            if (blocks.blockList[i].collapsed) {
                var parts = blocks.blockCollapseArt[i].split('><');
            } else {
                var parts = blocks.blockArt[i].split('><');
            }

            if (blocks.blockList[i].isCollapsible()) {
                svg += '<g>';
            }

            svg += '<g transform="translate(' + blocks.blockList[i].container.x + ', ' + blocks.blockList[i].container.y + ')">';
            if (SPECIALINPUTS.indexOf(blocks.blockList[i].name) !== -1) {
                for (var p = 1; p < parts.length; p++) {
                    // FIXME: This is fragile.
                    if (p === 1) {
                        svg += '<' + parts[p] + '><';
                    } else if (p === 2) {
                        // skip filter
                    } else if (p === 3) {
                        svg += parts[p].replace('filter:url(#dropshadow);', '') + '><';
                    } else if (p === 5) {
                        // Add block value to SVG between tspans
                        if (typeof (blocks.blockList[i].value) === 'string') {
                            console.debug(_(blocks.blockList[i].value));
                            svg += parts[p] + '>' + _(blocks.blockList[i].value) + '<';
                        } else {
                            svg += parts[p] + '>' + blocks.blockList[i].value + '<';
                        }
                    } else if (p === parts.length - 2) {
                        svg += parts[p] + '>';
                    } else if (p === parts.length - 1) {
                        // skip final </svg>
                    } else {
                        svg += parts[p] + '><';
                    }
                }
            } else {
                for (var p = 1; p < parts.length; p++) {
                    // FIXME: This is fragile.
                    if (p === 1) {
                        svg += '<' + parts[p] + '><';
                    } else if (p === 2) {
                        // skip filter
                    } else if (p === 3) {
                        svg += parts[p].replace('filter:url(#dropshadow);', '') + '><';
                    } else if (p === parts.length - 2) {
                        svg += parts[p] + '>';
                    } else if (p === parts.length - 1) {
                        // skip final </svg>
                    } else {
                        svg += parts[p] + '><';
                    }
                }
            }

            svg += '</g>';

            if (blocks.blockList[i].isCollapsible()) {
                if (INLINECOLLAPSIBLES.indexOf(blocks.blockList[i].name) !== -1) {
                    var y = blocks.blockList[i].container.y + 4;
                } else {
                    var y = blocks.blockList[i].container.y + 12;
                }

                svg += '<g transform="translate(' + blocks.blockList[i].container.x + ', ' + y + ') scale(0.5 0.5)">';
                if (blocks.blockList[i].collapsed) {
                    var parts = EXPANDBUTTON.split('><');
                } else {
                    var parts = COLLAPSEBUTTON.split('><');
                }

                for (var p = 2; p < parts.length - 1; p++) {
                    svg += '<' + parts[p] + '>';
                }

                svg += '</g>';
            }

            if (blocks.blockList[i].name === 'start') {
                var x = blocks.blockList[i].container.x + 110;
                var y = blocks.blockList[i].container.y + 12;
                svg += '<g transform="translate(' + x + ', ' + y + ') scale(0.4 0.4)">';

                var parts = TURTLESVG.replace(/fill_color/g, FILLCOLORS[startCounter]).replace(/stroke_color/g, STROKECOLORS[startCounter]).split('><');

                startCounter += 1;
                if (startCounter > 9) {
                    startCounter = 0;
                }

                for (var p = 2; p < parts.length - 1; p++) {
                    svg += '<' + parts[p] + '>';
                }

                svg += '</g>';
            }

            if (blocks.blockList[i].isCollapsible()) {
                svg += '</g>';
            }
        }

        svg += '</svg>';

        return '<svg xmlns="http://www.w3.org/2000/svg" width="' + xMax + '" height="' + yMax + '">' + encodeURIComponent(svg);
    };

    /*
     * Clears "canvas"
     */
    _allClear = function (noErase) {
        blocks.activeBlock = null;
        hideDOMLabel();

        if (chartBitmap != null) {
            stage.removeChild(chartBitmap);
           var chartBitmap = null;
        }

        logo.boxes = {};
        logo.time = 0;
        hideMsgs();
        logo.setBackgroundColor(-1);
        logo.notationOutput = '';
        for (var turtle = 0; turtle < turtles.turtleList.length; turtle++) {
            logo.turtleHeaps[turtle] = [];
            logo.notationStaging[turtle] = [];
            logo.notationDrumStaging[turtle] = [];
            if (noErase == undefined || !noErase) {
                turtles.turtleList[turtle].doClear(true, true, true);
            }
        }

        blocksContainer.x = 0;
        blocksContainer.y = 0;

        // Code specific to cleaning up music blocks
        Element.prototype.remove = function () {
            this.parentElement.removeChild(this);
        };

        NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
            for (var i = 0, len = this.length; i < len; i++) {
                if (this[i] && this[i].parentElement) {
                    this[i].parentElement.removeChild(this[i]);
                }
            }
        };

        var table = docById('myTable');
        if (table != null) {
            table.remove();
        }
    };

    /*
     * @param env {specifies environment}
     * Sets up play button functionality
     * Runs music blocks
     */
    this._doFastButton = function (env) {
        blocks.activeBlock = null;
        hideDOMLabel();

        var currentDelay = logo.turtleDelay;
        var playingWidget = false;
        logo.setTurtleDelay(0);
        if (_THIS_IS_MUSIC_BLOCKS_) {
            logo.synth.resume();

            /*
            if (docById('pscDiv').style.visibility === 'visible') {
                playingWidget = true;
                logo.pitchStaircase.playUpAndDown();
            }

            // We were using the run button to play a widget, not
            // the turtles.
            if (playingWidget) {
                return;
            }

            if (docById('tempoDiv').style.visibility === 'visible') {
                if (logo.tempo.isMoving) {
                    logo.tempo.pause();
                }

                logo.tempo.resume();
            }
            */

        }

        if (!turtles.running()) {
            console.debug('RUNNING');
            if (!turtles.isShrunk) {
                logo.hideBlocks(true);
            }

            logo.runLogoCommands(null, env);
        } else {
            if (currentDelay !== 0) {
                // keep playing at full speed
                console.debug('RUNNING FROM STEP');
                logo.step();
            } else {
                // stop and restart
                console.debug('STOPPING...');
                document.getElementById('stop').style.color = 'white';
                logo.doStopTurtle();

                setTimeout(function () {
                    console.debug('AND RUNNING');
                    document.getElementById('stop').style.color = '#ea174c';

                    logo.runLogoCommands(null, env);
                }, 500);
            }
        }
    };

    /*
     * Runs music blocks at a slower rate
     */
    this._doSlowButton = function () {
        blocks.activeBlock = null;
        hideDOMLabel();

        logo.setTurtleDelay(DEFAULTDELAY);
        if (_THIS_IS_MUSIC_BLOCKS_) {
            logo.synth.resume();
        }

        if (false) { // _THIS_IS_MUSIC_BLOCKS_ && docById('ptmDiv').style.visibility === 'visible') {
            logo.pitchTimeMatrix.playAll();
        } else if (!turtles.running()) {
            logo.runLogoCommands();
        } else {
            logo.step();
        }
    };

    /*
     * Runs music blocks step by step
     */
    _doStepButton = function () {
        blocks.activeBlock = null;
        hideDOMLabel();

        var turtleCount = Object.keys(logo.stepQueue).length;
        if (_THIS_IS_MUSIC_BLOCKS_) {
            logo.synth.resume();
        }

        if (turtleCount === 0 || logo.turtleDelay !== TURTLESTEP) {
            // Either we haven't set up a queue or we are
            // switching modes.
            logo.setTurtleDelay(TURTLESTEP);
            // Queue and take first step.
            if (!turtles.running()) {
                logo.runLogoCommands();
            }
            logo.step();
        } else {
            logo.setTurtleDelay(TURTLESTEP);
            logo.step();
        }
    };

    /*
     * @param onblur {when object loses focus}
     *
     * Stops running of music blocks.
     * Stops all mid-way synths
     */
    this.doHardStopButton = function (onblur) {
        blocks.activeBlock = null;
        hideDOMLabel();

        if (onblur == undefined) {
            onblur = false;
        }

        if (onblur && _THIS_IS_MUSIC_BLOCKS_ && logo.recordingStatus()) {
            console.debug('Ignoring hard stop due to blur');
            return;
        }

        logo.doStopTurtle();

        if (_THIS_IS_MUSIC_BLOCKS_) {
            logo._setMasterVolume(0);

            if (docById('tempoDiv') != null && docById('tempoDiv').style.visibility === 'visible') {
                if (logo.tempo.isMoving) {
                    logo.tempo.pause();
                }
            }
        }
    };

    /*
     * Switches between beginner/advanced mode
     */
    doSwitchMode = function () {
        blocks.activeBlock = null;
        var mode = localStorage.beginnerMode;

        const MSGPrefix = '<a href=\'#\' ' +
        'onClick=\'window.location.reload()\'' +
        'onMouseOver=\'this.style.opacity = 0.5\'' +
        'onMouseOut=\'this.style.opacity = 1\'>';
        const MSGSuffix = '</a>';

        if (mode === null || mode === undefined || mode === 'true') {
            textMsg(_(MSGPrefix + _('Refresh your browser to change to advanced mode.') + MSGSuffix));
            localStorage.setItem('beginnerMode', false);
        } else {
            textMsg(_(MSGPrefix + _('Refresh your browser to change to beginner mode.') + MSGSuffix));
            localStorage.setItem('beginnerMode', true);
        }

        refreshCanvas();
    };

    // DEPRECATED
    doStopButton = function () {
        blocks.activeBlock = null;
        logo.doStopTurtle();
    };

    // function doMuteButton() {
    //     logo._setMasterVolume(0);
    // };

    // function _hideBoxes() {
    //     blocks.activeBlock = null;
    //     hideDOMLabel();

    //     pasteBox.hide();
    // };

    /*
     * Initialises the functionality of the horizScrollIcon
     */
    function setScroller() {
        blocks.activeBlock = null;
        scrollBlockContainer = !scrollBlockContainer;
        scrollPaletteContainer = !scrollPaletteContainer;
        var enableHorizScrollIcon = docById('enableHorizScrollIcon');
        var disableHorizScrollIcon = docById('disableHorizScrollIcon');
        if (scrollBlockContainer && !beginnerMode) {
            enableHorizScrollIcon.style.display = 'none';
            disableHorizScrollIcon.style.display = 'block';
        } else {
            enableHorizScrollIcon.style.display = 'block';
            disableHorizScrollIcon.style.display = 'none';
        }
    };
    
    
    //Load Animation handler
    doLoadAnimation = function() {
        var messages = {'load_messages': [
            _('Catching mice'),
            _('Cleaning the instruments'),
            _('Testing key pieces'),
            _('Sight-reading'),
            _('Combining math and music'),
            _('Generating more blocks'),
            _('Do Re Mi Fa Sol La Ti Do'),
            _('Tuning string instruments'),
            _('Pressing random keys'),
        ]};

        document.getElementById('load-container').style.display = 'block';
        var counter = 0;
        setInterval(changeText, 2000);

        function changeText() {
            var randomLoadMessage = messages.load_messages[Math.floor(Math.random() * messages.load_messages.length)];
            document.getElementById('messageText').innerHTML = randomLoadMessage + '...';
            counter++;
            if (counter >= messages.load_messages.length) {
                counter = 0;
            }
        }
    };


    /*
     * @param chartBitmap bitmap of analysis charts
     * @param ctx canvas
     * Renders close icon and functionality to
     * stop analytics of the MB project
     */
    this.closeAnalytics = function (chartBitmap, ctx) {
        blocks.activeBlock = null;
        var button = this;
        button.x = (canvas.width / (2 * turtleBlocksScale)) + (300 / Math.sqrt(2));
        button.y = 200.0;
        this.closeButton = _makeButton(CANCELBUTTON, _('Close'), button.x, button.y, 55, 0);
        this.closeButton.on('click', function (event) {
            button.closeButton.visible = false;
            stage.removeChild(chartBitmap);
            logo.showBlocks();
            update = true;
            ctx.clearRect(0, 0, 600, 600);
        });
    };

    /*
     * @param canvas {compares existing canvas with a new blank canvas}
     * @return {boolean} {if canvas is blank }
     * Checks if the canvas is blank
     */
    function _isCanvasBlank(canvas) {
        var blank = document.createElement('canvas');
        blank.width = canvas.width;
        blank.height = canvas.height;
        return canvas.toDataURL() == blank.toDataURL();
    };


    /*
     * Renders and carries out analysis
     * of the MB project
     */
     closeAnalytics = this.closeAnalytics;
    var th = this;
    doAnalytics = function () {
        toolbar.closeAuxToolbar(_showHideAuxMenu);
        blocks.activeBlock = null;
        myChart = docById('myChart');

        if (_isCanvasBlank(myChart) == false) {
            return;
        }

      var ctx = myChart.getContext('2d');
        loading = true;
        document.body.style.cursor = 'wait';
        doLoadAnimation();
      var myRadarChart = null;
      var  scores = analyzeProject(blocks);
      var data = scoreToChartData(scores);
      var  Analytics = this;
      Analytics.close = th.closeAnalytics;

        __callback = function () {
            imageData = myRadarChart.toBase64Image();
            img = new Image();
            img.onload = function () {
                chartBitmap = new createjs.Bitmap(img);
                stage.addChild(chartBitmap);
                chartBitmap.x = (canvas.width / (2 * turtleBlocksScale)) - (300);
                chartBitmap.y = 200;
                chartBitmap.scaleX = chartBitmap.scaleY = chartBitmap.scale = 600 / chartBitmap.image.width;
                logo.hideBlocks();
                update = true;
                document.body.style.cursor = 'default';
                loading = false;
                Analytics.close(chartBitmap, ctx);
            };
            img.src = imageData;
        };

        options = getChartOptions(__callback);
        myRadarChart = new Chart(ctx).Radar(data, options);
    };

    // DEPRECATED
    function doOptimize(state) {
        blocks.activeBlock = null;
        console.debug('Setting optimize to ' + state);
        logo.setOptimize(state);
    };
    /*
     * Increases block size
     */
    doLargerBlocks = function () {
        blocks.activeBlock = null;

        // hideDOMLabel();

        if (!resizeDebounce) {
            if (blockscale < BLOCKSCALES.length - 1) {
               var resizeDebounce = true;
                blockscale += 1;
                blocks.setBlockScale(BLOCKSCALES[blockscale]);
                setTimeout(function () {
                    resizeDebounce = false;
                }, 3000);
            }

            setSmallerLargerStatus();
        }
    };

    /*
     * Decreases block size
     */
    doSmallerBlocks = function () {
        blocks.activeBlock = null;

        // hideDOMLabel();

        if (!resizeDebounce) {
            if (blockscale > 0) {
              var resizeDebounce = true;
                blockscale -= 1;
                blocks.setBlockScale(BLOCKSCALES[blockscale]);
            }
                setTimeout(function () {
                    resizeDebounce = false;
                }, 3000);
            }

        setSmallerLargerStatus();
    };

    /*
     * If either the block size has reached its minimum or maximum
     * then the icons to make them smaller/bigger will be hidden
     */
    setSmallerLargerStatus = function () {
        if (BLOCKSCALES[blockscale] > 1) {
            smallerContainer.visible = true;
            smallerOffContainer.visible = false;
        } else {
            smallerOffContainer.visible = true;
            smallerContainer.visible = false;
        }

        if (BLOCKSCALES[blockscale] == 4) {
            largerOffContainer.visible = true;
            largerContainer.visible = false;
        } else {
            largerContainer.visible = true;
            largerOffContainer.visible = false;
        }
    };

    /*
     * Removes loaded plugin
     */
    deletePlugin = function () {
        toolbar.closeAuxToolbar(_showHideAuxMenu);
        blocks.activeBlock = null;
        if (palettes.paletteObject !== null) {
            palettes.paletteObject.promptPaletteDelete();
        } else {
            // look to see if My Blocks palette is visible
            if (palettes.buttons['myblocks'].visible) {
                console.debug(palettes.dict['myblocks'].visible);
                if (palettes.dict['myblocks'].visible) {
                    palettes.dict['myblocks'].promptMacrosDelete();
                }
            }
        }
    };

    // function getPlaybackQueueStatus() {
    //     return Object.keys(logo.playbackQueue).length > 0;
    // };

    function setPlaybackStatus() {
        // if (playbackBox != null) {
        //     playbackBox.setPlaybackStatus();
        // }
    };

    // function doPausePlayback() {
    //     blocks.activeBlock = null;
    //     logo.restartPlayback = false;
    //     logo.playback(-1);
    //     // playbackBox.playButton.visible = true;
    //     // playbackBox.pauseButton.visible = false;
    // };

    // function doPlayback() {
    //     blocks.activeBlock = null;
    //     progressBar.style.visibility = 'visible';
    //     progressBar.style.left = (playbackBox.getPos()[0] + 10) * turtleBlocksScale + 'px';
    //     progressBar.style.top = (playbackBox.getPos()[1] + 10) * turtleBlocksScale + 'px';
    //     logo.playback(-1);
    //     // playbackBox.playButton.visible = false;
    //     // playbackBox.pauseButton.visible = true;
    //     // playbackBox.norewindButton.visible = false;
    //     // playbackBox.rewindButton.visible = true;
    // };

    // function doRestartPlayback() {
    //     blocks.activeBlock = null;
    //     logo.doStopTurtle();
    //     logo.restartPlayback = true;

    //     /*
    //     setTimeout(function () {
    //         // logo.playback(-1);
    //         playbackBox.playButton.visible = true;
    //         playbackBox.pauseButton.visible = false;
    //         playbackBox.norewindButton.visible = true;
    //         playbackBox.rewindButton.visible = false;
    //     }, 500);
    //     */
    // };

    // // Deprecated
    // function doCompile() {
    //     blocks.activeBlock = null;
    //     logo.restartPlayback = true;
    //     document.body.style.cursor = 'wait';
    //     console.debug('Compiling music for playback');

    //     // Suppress music and turtle output when generating
    //     // compiled output.
    //     logo.setTurtleDelay(0); // Compile at full speed.
    //     logo.playbackQueue = {};
    //     logo.playbackTime = 0;
    //     logo.compiling = true;
    //     logo.runLogoCommands();
    // };

    /*
     * Hides all grids (Cartesian/polar)
     */
    hideGrids = function () {
        turtles.setGridLabel(_('show Cartesian'));
        _hideCartesian();
        _hidePolar();
    };

    /*
     * Renders Cartesian/Polar grids and changes button labels accordingly
     */
    _doCartesianPolar = function () {
        if (cartesianBitmap.visible && polarBitmap.visible) {
            _hideCartesian();
            //.TRANS: hide Polar coordinate overlay grid
            turtles.setGridLabel(_('hide Polar'));
        } else if (!cartesianBitmap.visible && polarBitmap.visible) {
            _hidePolar();
            //.TRANS: show Cartesian coordinate overlay grid
            turtles.setGridLabel(_('show Cartesian'));
        } else if (!cartesianBitmap.visible && !polarBitmap.visible) {
            _showCartesian();
            turtles.setGridLabel(_('show Polar'));
        } else if (cartesianBitmap.visible && !polarBitmap.visible) {
            _showPolar();
            //.TRANS: show Polar coordinate overlay grid
            turtles.setGridLabel(_('hide Cartersian'));
        }

        update = true;
    };

    /*
     * Sets up block actions with regards to different mouse events
     */
    this._setupBlocksContainerEvents = function () {
        var moving = false;
        var lastCoords = {
            x: 0,
            y: 0,
            delta: 0
        };

        var __paletteWheelHandler = function (event) {
            // vertical scroll
            if (event.deltaY != 0 && event.axis === event.VERTICAL_AXIS) {
                if (palettes.paletteVisible) {
                    if (event.clientX > cellSize + MENUWIDTH) {
                        palettesContainer.y -= event.deltaY;
                    }
                } else {
                    if (event.clientX > cellSize) {
                        palettesContainer.y -= event.deltaY;
                    }
                }
            }

            // horizontal scroll
            if (scrollPaletteContainer) {
                if (event.deltaX != 0 && event.axis === event.HORIZONTAL_AXIS) {
                    if (palettes.paletteVisible) {
                        if (event.clientX > cellSize + MENUWIDTH) {
                            palettesContainer.x -= event.deltaX;
                        }
                    } else {
                        if (event.clientX > cellSize) {
                            palettesContainer.x -= event.deltaX;
                        }
                    }
                }
            } else {
                event.preventDefault();
            }

            refreshCanvas();
        };

        var myCanvas = docById('myCanvas')

        var __heightBasedScroll = function (event) {
            actualReszieHandler(); // check size during init
            window.addEventListener("resize", resizeThrottler, false);
            var resizeTimeout;

            function resizeThrottler() {
                // Ignore resize events as long as an actualResizeHandler
                // execution is in queue.
                if (!resizeTimeout) {
                    resizeTimeout = setTimeout(function () {
                        resizeTimeout = null;
                        actualReszieHandler();
                        // The actualResizeHandler will execute at the
                        // rate of 15 FPS.
                    }, 66);
                }
            };
        };

        function actualReszieHandler () {
            // Handle the resize event
            var h = window.innerHeight;

            if (h < 500) { //activate on mobile
                myCanvas.addEventListener('wheel', __paletteWheelHandler, false);
            } else {
                // Cleanup event listeners
                myCanvas.removeEventListener('wheel', __paletteWheelHandler);
            }
        };

        __heightBasedScroll()

        var __wheelHandler = function (event) {
            if (event.deltaY != 0 && event.axis === event.VERTICAL_AXIS) {
                if (palettes.paletteVisible) {
                    if (event.clientX > cellSize + MENUWIDTH) {
                        blocksContainer.y -= event.deltaY;
                    }
                } else {
                    if (event.clientX > cellSize) {
                        blocksContainer.y -= event.deltaY;
                    }
                }
            }

            // horizontal scroll
            if (scrollBlockContainer) {
                if (event.deltaX != 0 && event.axis === event.HORIZONTAL_AXIS) {
                    if (palettes.paletteVisible) {
                        if (event.clientX > cellSize + MENUWIDTH) {
                            blocksContainer.x -= event.deltaX;
                        }
                    } else {
                        if (event.clientX > cellSize) {
                            blocksContainer.x -= event.deltaX;
                        }
                    }
                }
            } else {
                event.preventDefault();
            }

            refreshCanvas();
        };

        docById('myCanvas').addEventListener('wheel', __wheelHandler, false);

        var __stageMouseUpHandler = function (event) {
            stageMouseDown = false;
            moving = false;

            if (stage.getObjectUnderPoint() === null && lastCoords.delta < 4) {
                stageX = event.stageX;
                stageY = event.stageY;
            }

        };

        stage.on('stagemousemove', function (event) {
            stageX = event.stageX;
            stageY = event.stageY;
        });

        stage.on('stagemousedown', function (event) {
            stageMouseDown = true;
            if (stage.getObjectUnderPoint() !== null | turtles.running()) {
                stage.removeAllEventListeners('stagemouseup');
                stage.on('stagemouseup', __stageMouseUpHandler);
                return;
            }

            moving = true;
            lastCoords = {
                x: event.stageX,
                y: event.stageY,
                delta: 0
            };

            hideDOMLabel();

            stage.removeAllEventListeners('stagemousemove');
            stage.on('stagemousemove', function (event) {
                stageX = event.stageX;
                stageY = event.stageY;

                if (!moving) {
                    return;
                }

                // if we are moving the block container, deselect the active block.
                blocks.activeBlock = null;

                var delta = Math.abs(event.stageX - lastCoords.x) + Math.abs(event.stageY - lastCoords.y);

                if (scrollBlockContainer) {
                    blocksContainer.x += event.stageX - lastCoords.x;
                }

                blocksContainer.y += event.stageY - lastCoords.y;
                lastCoords = {
                    x: event.stageX,
                    y: event.stageY,
                    delta: lastCoords.delta + delta
                };

                refreshCanvas();
            });

            stage.removeAllEventListeners('stagemouseup');
            stage.on('stagemouseup', __stageMouseUpHandler);
        });
    };

    /*
     * Sets up scrolling functionality in palette and across canvas
     */
    function scrollEvent(event) {
        var data = event.wheelDelta || -event.detail;
        var delta = Math.max(-1, Math.min(1, (data)));
        var scrollSpeed = 30;

        if (event.clientX < cellSize) {
            palettes.menuScrollEvent(delta, scrollSpeed);
            palettes.hidePaletteIconCircles();
        } else {
           var palette = palettes.findPalette(event.clientX / turtleBlocksScale, event.clientY / turtleBlocksScale);
            if (palette) {
                // if we are moving the palettes, deselect the active block.
                blocks.activeBlock = null;

                palette.scrollEvent(delta, scrollSpeed);
            }
        }
    };

    function getStageScale() {
        return turtleBlocksScale;
    };

    function getStageX() {
        return turtles.screenX2turtleX(stageX / turtleBlocksScale);
    };

    function getStageY() {
        return turtles.screenY2turtleY((stageY - toolbarHeight) / turtleBlocksScale);
    };

    function getStageMouseDown() {
        return stageMouseDown;
    };

    // function setCameraID(id) {
    //     cameraID = id;
    // };

    /*
     * @param imagePath {path of grid to be rendered}
     * Renders grid
     */
    _createGrid = function (imagePath) {
        var img = new Image();
        img.src = imagePath;
        var container = new createjs.Container();
        stage.addChild(container);

        var bitmap = new createjs.Bitmap(img);
        container.addChild(bitmap);
        bitmap.cache(0, 0, 1200, 900);

        bitmap.x = (canvas.width - 1200) / 2;
        bitmap.y = (canvas.height - 900) / 2;
        bitmap.scaleX = bitmap.scaleY = bitmap.scale = 1;
        bitmap.visible = false;
        bitmap.updateCache();

        return bitmap;
    };

    /*
     * @param  fillColor   {inner color of message}
     * @param  strokeColor {border of message}
     * @param  callback    {callback function assigned to particular message}
     * @param  y           {position on canvas}
     * @return {description}
     */
    _createMsgContainer = function (fillColor, strokeColor, callback, y) {
        var container = new createjs.Container();
        stage.addChild(container);
        container.x = (canvas.width - 1000) / 2;
        container.y = y;
        container.visible = false;

        var img = new Image();
        var svgData = MSGBLOCK.replace('fill_color', fillColor).replace(
            'stroke_color', strokeColor);

        img.onload = function () {
            var msgBlock = new createjs.Bitmap(img);
            container.addChild(msgBlock);
            var text = new createjs.Text('your message here', '20px Arial', '#000000');
            container.addChild(text);
            text.textAlign = 'center';
            text.textBaseline = 'alphabetic';
            text.x = 500;
            text.y = 30;

            var bounds = container.getBounds();
            container.cache(bounds.x, bounds.y, bounds.width, bounds.height);

            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill('#FFF').drawRect(0, 0, 1000, 42);
            hitArea.x = 0;
            hitArea.y = 0;
            container.hitArea = hitArea;

            container.on('click', function (event) {
                container.visible = false;
                // On the possibility that there was an error
                // arrow associated with this container
                if (errorMsgArrow != null) {
                    errorMsgArrow.removeAllChildren(); // Hide the error arrow.
                }

                update = true;
            });

            callback(text);
            blocks.setMsgText(text);
        };

        img.src = 'data:image/svg+xml;base64,' + window.btoa(
            unescape(encodeURIComponent(svgData)));
    };


    /*
     * Some error messages have special artwork.
     */
    _createErrorContainers = function () {
        for (var i = 0; i < ERRORARTWORK.length; i++) {
            var name = ERRORARTWORK[i];
            _makeErrorArtwork(name);
        }
    };

    /*
     * @param  name {specifies svg to be rendered}
     * renders error message with appropriate artwork
     */
    _makeErrorArtwork = function (name) {
        var container = new createjs.Container();
        stage.addChild(container);
        container.x = (canvas.width - 1000) / 2;
        container.y = 80;
        errorArtwork[name] = container;
        errorArtwork[name].name = name;
        errorArtwork[name].visible = false;

        var img = new Image();
        img.onload = function () {
            var artwork = new createjs.Bitmap(img);
            container.addChild(artwork);
            var text = new createjs.Text('', '20px Sans', '#000000');
            container.addChild(text);
            text.x = 70;
            text.y = 10;

            var bounds = container.getBounds();
            container.cache(bounds.x, bounds.y, bounds.width, bounds.height);

            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill('#FFF').drawRect(0, 0, bounds.width, bounds.height);
            hitArea.x = 0;
            hitArea.y = 0;
            container.hitArea = hitArea;

            container.on('click', function (event) {
                container.visible = false;
                // On the possibility that there was an error
                // arrow associated with this container
                if (errorMsgArrow != null) {
                    errorMsgArrow.removeAllChildren(); // Hide the error arrow.
                }
                update = true;
            });
        };

        img.src = 'images/' + name + '.svg';
    };

    /*
      Prepare a list of blocks for the search bar autocompletion.
     */
    prepSearchWidget = function () {
        searchWidget.style.visibility = 'hidden';
        searchBlockPosition = [100, 100];

        searchSuggestions = [];
        deprecatedBlockNames = [];

        for (i in blocks.protoBlockDict) {
            blockLabel = blocks.protoBlockDict[i].staticLabels[0];
            if (blockLabel) {
                if (blocks.protoBlockDict[i].deprecated) {
                    deprecatedBlockNames.push(blockLabel);
                } else {
                    searchSuggestions.push(blockLabel);
                }
            }
        }

        searchSuggestions = searchSuggestions.reverse();

        // searchWidget.onclick = function () {
        //     console.debug('DO SEARCH');
        //     doSearch();
        // };
    }

    /*
     * Hides search widget
     */
    hideSearchWidget = function () {
        // Hide the jQuery search results widget
        var obj = docByClass('ui-menu');
        if (obj.length > 0) {
            obj[0].style.visibility = 'hidden';
        }

        searchWidget.style.visibility = 'hidden';
    };

    /*
     * Shows search widget
     */
    showSearchWidget = function () {
        if (searchWidget.style.visibility === 'visible') {
            hideSearchWidget();
        } else {
            var obj = docByClass('ui-menu');
            if (obj.length > 0) {
                obj[0].style.visibility = 'visible';
            }

            searchWidget.value = null;
            docById('searchResults').style.visibility = 'visible';
            searchWidget.style.visibility = 'visible';
            searchWidget.style.left = palettes.getSearchPos()[0] * turtleBlocksScale + 'px';
            searchWidget.style.top = palettes.getSearchPos()[1] * turtleBlocksScale + 'px';

            searchBlockPosition = [100, 100];

            // Give the browser time to update before selecting
            // focus.
            setTimeout(function () {
                console.debug('DO SEARCH!!!');
                searchWidget.focus();
                doSearch();
            }, 500);
        }
    };

    /*
     * Uses JQuery to add autocompleted search suggestions
     */
    doSearch = function () {
        var $j = jQuery.noConflict();

        $j('#search').autocomplete({
            source: searchSuggestions
        });

        $j('#search').autocomplete('widget').addClass('scrollSearch');

        var searchInput = searchWidget.value;
        var obj = palettes.getProtoNameAndPalette(searchInput);
        var protoblk = obj[0];
        var paletteName = obj[1];
        var protoName = obj[2];

        var searchResult = blocks.protoBlockDict.hasOwnProperty(protoName);

        if (searchInput.length > 0) {
            if (searchResult) {
                palettes.dict[paletteName].makeBlockFromSearch(protoblk, protoName, function (newBlock) {
                    blocks.moveBlock(newBlock, 100 + searchBlockPosition[0] - blocksContainer.x, searchBlockPosition[1] - blocksContainer.y);

                });

                // Move the position of the next newly created block.
                searchBlockPosition[0] += STANDARDBLOCKHEIGHT;
                searchBlockPosition[1] += STANDARDBLOCKHEIGHT;
            } else if (deprecatedBlockNames.indexOf(searchInput) > -1) {
                blocks.errorMsg(_('This block is deprecated.'));
            } else {
                blocks.errorMsg(_('Block cannot be found.'));
            }

            searchWidget.value = '';
            update = true;
        }
    };

    /*
     * Makes initial "start up" note for a brand new MB project
     */
    __makeNewNote = function (octave, solf) {
        var newNote = [
            [0, 'newnote', 300 - blocksContainer.x, 300 - blocksContainer.y, [null, 1, 4, 8]],
            [1, 'divide', 0, 0, [0, 2, 3]],
            [2, ['number', {
                'value': 1
            }], 0, 0, [1]],
            [3, ['number', {
                'value': 4
            }], 0, 0, [1]],
            [4, 'vspace', 0, 0, [0, 5]],
            [5, 'pitch', 0, 0, [4, 6, 7, null]],
            [6, ['solfege', {
                'value': solf
            }], 0, 0, [5]],
            [7, ['number', {
                'value': octave
            }], 0, 0, [5]],
            [8, 'hidden', 0, 0, [0, null]]
        ];

        blocks.loadNewBlocks(newNote);
        if (blocks.activeBlock !== null) {
            // Connect the newly created block to the active block
            // (if it is a hidden block at the end of a new note
            // block).
            var bottom = blocks.findBottomBlock(blocks.activeBlock);
            console.debug(blocks.activeBlock + ' ' + bottom);
            if (blocks.blockList[bottom].name === 'hidden' && blocks.blockList[blocks.blockList[bottom].connections[0]].name === 'newnote') {

                // The note block macro creates nine blocks.
                var newlyCreatedBlock = blocks.blockList.length - 9;

                // Set last connection of active block to the
                // newly created block.
                var lastConnection = blocks.blockList[bottom].connections.length - 1
                blocks.blockList[bottom].connections[lastConnection] = newlyCreatedBlock;

                // Set first connection of the newly created block to
                // the active block.
                blocks.blockList[newlyCreatedBlock].connections[0] = bottom;
                // Adjust the dock positions to realign the stack.
                blocks.adjustDocks(bottom, true);
            }
        }

        // Set new hidden block at the end of the newly created
        // note block to the active block.
        blocks.activeBlock = blocks.blockList.length - 1;
    }

    /*
     * Handles keyboard shortcuts in MB
     */
    function __keyPressed(event) {
        var that = this;
        if (docById('labelDiv').classList.contains('hasKeyboard')) {
            return;
        }

        if (_THIS_IS_MUSIC_BLOCKS_) {
            if (docById('BPMInput').classList.contains('hasKeyboard')) {
                return;
            }

            if (docById('musicratio1').classList.contains('hasKeyboard')) {
                return;
            }

            if (docById('musicratio2').classList.contains('hasKeyboard')) {
                return;
            }

            if (docById('dissectNumber').classList.contains('hasKeyboard')) {
                return;
            }

            if (docById('timbreName') !== null) {
                if (docById('timbreName').classList.contains('hasKeyboard')) {
                    return;
                }
            }
        }

        const BACKSPACE = 8;
        const TAB = 9;

        if (event.keyCode === TAB) { // || event.keyCode === BACKSPACE) {
            // Prevent browser from grabbing TAB key
            event.preventDefault();
            return false;
        }

        const ESC = 27;
        const ALT = 18;
        const CTRL = 17;
        const SHIFT = 16;
        const RETURN = 13;
        const SPACE = 32;
        const HOME = 36;
        const END = 35;
        const PAGE_UP = 33;
        const PAGE_DOWN = 34;
        const KEYCODE_LEFT = 37;
        const KEYCODE_RIGHT = 39;
        const KEYCODE_UP = 38;
        const KEYCODE_DOWN = 40;
        const DEL = 46;
        const V = 86;

        // Shortcuts for creating new notes
        const KEYCODE_D = 68; // do
        const KEYCODE_R = 82; // re
        const KEYCODE_M = 77; // mi
        const KEYCODE_F = 70; // fa
        const KEYCODE_S = 83; // so
        const KEYCODE_L = 76; // la
        const KEYCODE_T = 84; // ti

        // Check for RETURN in search widget ahead of other events.
        if (event.keyCode === RETURN && docById('search').value.length > 0) {
            doSearch();
        }

        if (_THIS_IS_MUSIC_BLOCKS_) {
            var disableKeys = docById('lilypondModal').style.display === 'block' || searchWidget.style.visibility === 'visible' || docById('planet-iframe').style.display === '' || docById('paste').style.visibility === 'visible' || docById('wheelDiv').style.display === '' || logo.turtles.running();
        } else {
            var disableKeys = searchWidget.style.visibility === 'visible' || docById('paste').style.visibility === 'visible' || logo.turtles.running();
        }

        var disableArrowKeys = _THIS_IS_MUSIC_BLOCKS_ && (docById('tempoDiv').style.visibility === 'visible');

        if (event.altKey && !disableKeys) {
            switch (event.keyCode) {
            case 66: // 'B'
                textMsg('Alt-B ' + _('Saving block artwork'));
                save.saveBlockArtwork();
                break;
            case 67: // 'C'
                textMsg('Alt-C ' + _('Copy'));
                blocks.prepareStackForCopy();
                break;
            case 68: // 'D'
                palettes.dict['myblocks'].promptMacrosDelete()
                break;
            case 69: // 'E'
                textMsg('Alt-E ' + _('Erase'));
                _allClear(false);
                break;
            case 80: // 'P'
                // logo.playback(-1);
                break;
            case 82: // 'R'
                textMsg('Alt-R ' + _('Play'));
                that._doFastButton();
                break;
            case 83: // 'S'
                textMsg('Alt-S ' + _('Stop'));
                logo.doStopTurtle();
                break;
            case 86: // 'V'
                textMsg('Alt-V ' + _('Paste'));
                blocks.pasteStack();
                break;
            case 72:  // 'H' save block help
                textMsg('Alt-H ' + _('Save block help'));
                _saveHelpBlocks();
                break;
            }
        } else if (event.ctrlKey) {
            switch (event.keyCode) {
            case V:
                textMsg('Ctl-V ' + _('Paste'));
                pasteBox.createBox(turtleBlocksScale, 200, 200);
                pasteBox.show();
                docById('paste').style.left = (pasteBox.getPos()[0] + 10) * turtleBlocksScale + 'px';
                docById('paste').style.top = (pasteBox.getPos()[1] + 10) * turtleBlocksScale + 'px';
                docById('paste').focus();
                docById('paste').style.visibility = 'visible';
                update = true;
                break;
            }
        } else if (event.shiftKey && !disableKeys) {
            var solfnotes_ = _('ti la sol fa mi re do').split(' ');
            switch (event.keyCode) {
            case KEYCODE_D:
                if (_THIS_IS_MUSIC_BLOCKS_) {
                    textMsg('D ' + solfnotes_[6]);
                    __makeNewNote(5, 'do');
                }
                break;
            case KEYCODE_R:
                if (_THIS_IS_MUSIC_BLOCKS_) {
                    textMsg('R ' + solfnotes_[5]);
                    __makeNewNote(5, 're');
                }
                break;
            case KEYCODE_M:
                if (_THIS_IS_MUSIC_BLOCKS_) {
                    textMsg('M ' + solfnotes_[4]);
                    __makeNewNote(5, 'mi');
                }
                break;
            case KEYCODE_F:
                if (_THIS_IS_MUSIC_BLOCKS_) {
                    textMsg('F ' + solfnotes_[3]);
                    __makeNewNote(5, 'fa');
                }
                break;
            case KEYCODE_S:
                if (_THIS_IS_MUSIC_BLOCKS_) {
                    textMsg('S ' + solfnotes_[2]);
                    __makeNewNote(5, 'sol');
                }
                break;
            case KEYCODE_L:
                if (_THIS_IS_MUSIC_BLOCKS_) {
                    textMsg('L ' + solfnotes_[1]);
                    __makeNewNote(5, 'la');
                }
                break;
            case KEYCODE_T:
                if (_THIS_IS_MUSIC_BLOCKS_) {
                    textMsg('T ' + solfnotes_[0]);
                    __makeNewNote(5, 'ti');
                }
                break;
            }
        } else {
            if (docById('paste').style.visibility === 'visible' && event.keyCode === RETURN) {
                if (docById('paste').value.length > 0) {
                    pasted();
                }
            } else if (!disableKeys) {
                var solfnotes_ = _('ti la sol fa mi re do').split(' ');
                switch (event.keyCode) {
                case END:
                    textMsg('END ' + _('Jumping to the bottom of the page.'));
                    blocksContainer.y = -blocks.bottomMostBlock() + logo.canvas.height / 2;
                    break;
                case PAGE_UP:
                    textMsg('PAGE_UP ' + _('Scrolling up.'));
                    blocksContainer.y += logo.canvas.height / 2;
                    stage.update();
                    break;
                case PAGE_DOWN:
                    textMsg('PAGE_DOWN ' + _('Scrolling down.'));
                    blocksContainer.y -= logo.canvas.height / 2;
                    stage.update();
                    break;
                case DEL:
                    textMsg('DEL ' + _('Extracting block'));
                    blocks.extract();
                    break;
                case KEYCODE_UP:
                    textMsg('UP ARROW ' + _('Moving block up.'));
                    if (disableArrowKeys) {} else if (blocks.activeBlock != null) {
                        blocks.moveStackRelative(blocks.activeBlock, 0, -STANDARDBLOCKHEIGHT / 2);
                        blocks.blockMoved(blocks.activeBlock);
                        blocks.adjustDocks(blocks.activeBlock, true);
                    } else if (palettes.mouseOver) {
                        palettes.menuScrollEvent(1, 10);
                        palettes.hidePaletteIconCircles();
                    } else if (palettes.activePalette != null) {
                        palettes.activePalette.scrollEvent(STANDARDBLOCKHEIGHT, 1);
                    } else if (scrollBlockContainer) {
                        blocksContainer.y -= 20;
                    }
                    stage.update();
                    break;
                case KEYCODE_DOWN:
                    textMsg('UP ARROW ' + _('Moving block down.'));
                    if (disableArrowKeys) {} else if (blocks.activeBlock != null) {
                        blocks.moveStackRelative(blocks.activeBlock, 0, STANDARDBLOCKHEIGHT / 2);
                        blocks.blockMoved(blocks.activeBlock);
                        blocks.adjustDocks(blocks.activeBlock, true);
                    } else if (palettes.mouseOver) {
                        palettes.menuScrollEvent(-1, 10);
                        palettes.hidePaletteIconCircles();
                    } else if (palettes.activePalette != null) {
                        palettes.activePalette.scrollEvent(-STANDARDBLOCKHEIGHT, 1);
                    } else if (scrollBlockContainer) {
                        blocksContainer.y += 20;
                    }
                    stage.update();
                    break;
                case KEYCODE_LEFT:
                    textMsg('LEFT ARROW ' + _('Moving block left.'));
                    if (disableArrowKeys) {} else if (blocks.activeBlock != null) {
                        blocks.moveStackRelative(blocks.activeBlock, -STANDARDBLOCKHEIGHT / 2, 0);
                        blocks.blockMoved(blocks.activeBlock);
                        blocks.adjustDocks(blocks.activeBlock, true);
                    } else if (scrollBlockContainer) {
                        blocksContainer.x -= 20;
                    }
                    stage.update();
                    break;
                case KEYCODE_RIGHT:
                    textMsg('RIGHT ARROW ' + _('Moving block right.'));
                    if (disableArrowKeys) {} else if (blocks.activeBlock != null) {
                        blocks.moveStackRelative(blocks.activeBlock, STANDARDBLOCKHEIGHT / 2, 0);
                        blocks.blockMoved(blocks.activeBlock);
                        blocks.adjustDocks(blocks.activeBlock, true);
                    } else if (scrollBlockContainer) {
                        blocksContainer.x += 20;
                    }
                    stage.update();
                    break;
                case HOME:
                    textMsg('HOME ' + _('Jump to home position.'));
                    if (palettes.mouseOver) {
                        var dy = Math.max(55 - palettes.buttons['rhythm'].y, 0);
                        palettes.menuScrollEvent(1, dy);
                        palettes.hidePaletteIconCircles();
                    } else if (palettes.activePalette != null) {
                        palettes.activePalette.scrollEvent(-palettes.activePalette.scrollDiff, 1);
                    } else {
                        // Bring all the blocks "home".
                        _findBlocks();
                    }
                    stage.update();
                    break;
                case TAB:
                    break;
                case SPACE:
                    if (turtleContainer.scaleX == 1) {
                        turtles.scaleStage(0.5);
                    } else {
                        turtles.scaleStage(1);
                    }
                    break;
                case ESC:
                    if (searchWidget.style.visibility === 'visible') {
                        textMsg('ESC ' + _('Hide blocks.'));
                        searchWidget.style.visibility = 'hidden';
                    } else {
                        // toggle full screen
                        // _toggleToolbar();
                    }
                    break;
                case RETURN:
                    if (disableArrowKeys) {} else if (docById('search').value.length > 0) {
                        doSearch();
                    } else {
                        textMsg('Return ' + _('Play'));
                        if (blocks.activeBlock == null || SPECIALINPUTS.indexOf(blocks.blockList[blocks.activeBlock].name) === -1) {
                            logo.runLogoCommands();
                        }
                    }
                    break;
                case KEYCODE_D:
                    if (_THIS_IS_MUSIC_BLOCKS_) {
                        textMsg('d ' + solfnotes_[6]);
                        __makeNewNote(4, 'do');
                    }
                    break;
                case KEYCODE_R:
                    if (_THIS_IS_MUSIC_BLOCKS_) {
                        textMsg('r ' + solfnotes_[5]);
                        __makeNewNote(4, 're');
                    }
                    break;
                case KEYCODE_M:
                    if (_THIS_IS_MUSIC_BLOCKS_) {
                        textMsg('m ' + solfnotes_[4]);
                        __makeNewNote(4, 'mi');
                    }
                    break;
                case KEYCODE_F:
                    if (_THIS_IS_MUSIC_BLOCKS_) {
                        textMsg('f ' + solfnotes_[3]);
                        __makeNewNote(4, 'fa');
                    }
                    break;
                case KEYCODE_S:
                    if (_THIS_IS_MUSIC_BLOCKS_) {
                        textMsg('s ' + solfnotes_[2]);
                        __makeNewNote(4, 'sol');
                    }
                    break;
                case KEYCODE_L:
                    if (_THIS_IS_MUSIC_BLOCKS_) {
                        textMsg('l ' + solfnotes_[1]);
                        __makeNewNote(4, 'la');
                    }
                    break;
                case KEYCODE_T:
                    if (_THIS_IS_MUSIC_BLOCKS_) {
                        textMsg('t ' + solfnotes_[0]);
                        __makeNewNote(4, 'ti');
                    }
                    break;
                default:
                    break;
                }
            }

            // Always store current key so as not to mask it from
            // the keyboard block.
            currentKeyCode = event.keyCode;
        }
    };

    /*
     * @return currentKeyCode
     */
    this.getCurrentKeyCode = function () {
        return currentKeyCode;
    };

    /*
     * Sets current key code to 0
     */
    this.clearCurrentKeyCode = function () {
        currentKey = '';
        currentKeyCode = 0;
    };

    /*
     * Handles resizing for MB.
     * Detects width/height changes and closes any menus before actual resize.
     * Repositions containers/palette/home buttons
     */
    function _onResize(force) {
        var $j = jQuery.noConflict();
        console.debug('document.body.clientWidth and clientHeight: ' + document.body.clientWidth + ' ' + document.body.clientHeight);
        console.debug('stored values: ' + this._clientWidth + ' ' + this._clientHeight);

        console.debug('window inner/outer width/height: ' + window.innerWidth + ', ' + window.innerHeight + ' ' + window.outerWidth + ', ' + window.outerHeight);

        if (!platform.androidWebkit) {
            var w = window.innerWidth;
            var h = window.innerHeight;
        } else {
            var w = window.outerWidth;
            var h = window.outerHeight;
        }

        // If the clientWidth hasn't changed, don't resize (except
        // on init).
        if (!force && this._clientWidth === document.body.clientWidth) {
            // console.debug('NO WIDTH CHANGE');
            // return;
        }

        this._clientWidth = document.body.clientWidth;
        this._clientHeight = document.body.clientHeight;
        this._innerWidth = window.innerWidth;
        this._innerHeight = window.innerHeight;
        this._outerWidth = window.outerWidth;
        this._outerHeight = window.outerHeight;

        if (largerContainer !== null) {
            homeButtonContainers[0].x = this._innerWidth - 4 * 55 - 27.5;
            homeButtonContainers[1].x = homeButtonContainers[0].x;
            hideBlocksContainer.x = homeButtonContainers[0].x;
            collapseBlocksContainer.x = homeButtonContainers[0].x;
            smallerContainer.x = homeButtonContainers[0].x;
            largerContainer.x = homeButtonContainers[0].x;

            homeButtonContainers[0].y = this._innerHeight - 27.5;
            homeButtonContainers[1].y = homeButtonContainers[0].y;
            hideBlocksContainer.y = homeButtonContainers[0].y;
            collapseBlocksContainer.y = homeButtonContainers[0].y;
            smallerContainer.y = homeButtonContainers[0].y;
            largerContainer.y = homeButtonContainers[0].y;
        }

        if (docById('labelDiv').classList.contains('hasKeyboard')) {
            return;
        }

        var smallSide = Math.min(w, h);

        if (smallSide < cellSize * 9) {
            // var mobileSize = true;
            // FIXME
            var mobileSize = false;
            if (w < cellSize * 10) {
                turtleBlocksScale = smallSide / (cellSize * 11);
            } else {
                turtleBlocksScale = Math.max(smallSide / (cellSize * 11), 0.75);
            }
        } else {
            var mobileSize = false;
            if (w / 1200 > h / 900) {
                turtleBlocksScale = w / 1200;
            } else {
                turtleBlocksScale = h / 900;
            }
        }

        turtleBlocksScale = 1.0;

        stage.scaleX = turtleBlocksScale;
        stage.scaleY = turtleBlocksScale;

        stage.canvas.width = w;
        stage.canvas.height = h;

        turtles.setScale(w, h, turtleBlocksScale);

        blocks.setScale(turtleBlocksScale);
        boundary.setScale(w, h, turtleBlocksScale);

        palettes.setScale(turtleBlocksScale);

        trashcan.resizeEvent(turtleBlocksScale);

        // We need to reposition the palette buttons
        _setupPaletteMenu(turtleBlocksScale);

        // Reposition coordinate grids.
        cartesianBitmap.x = (canvas.width / (2 * turtleBlocksScale)) - (600);
        cartesianBitmap.y = (canvas.height / (2 * turtleBlocksScale)) - (450);
        polarBitmap.x = (canvas.width / (2 * turtleBlocksScale)) - (600);
        polarBitmap.y = (canvas.height / (2 * turtleBlocksScale)) - (450);
        update = true;

        // Hide tooltips on mobile
        if (platform.mobile) {
            // palettes.setMobile(true);
            // palettes.hide();
            toolbar.disableTooltips($j);
        } else {
            palettes.setMobile(false);
            palettes.bringToTop();
        }

        for (var turtle = 0; turtle < turtles.turtleList.length; turtle++) {
            turtles.turtleList[turtle].doClear(false, false, true);
        }

        var artcanvas = docById('overlayCanvas');
        // Workaround for #795.5
        if (mobileSize) {
            artcanvas.width = w * 2;
            artcanvas.height = h * 2;
        } else {
            artcanvas.width = w;
            artcanvas.height = h;
        }

        blocks.checkBounds();
    };

    window.onresize = function () {
        _onResize(false);
    };

    /*
     * Restore last stack pushed to trashStack back onto canvas.
     * Hides palettes before update
     * Repositions blocks about trash area
     */
    _restoreTrash = function () {
        for (var name in blocks.palettes.dict) {
            blocks.palettes.dict[name].hideMenu(true);
        }

        blocks.activeBlock = null;
        refreshCanvas();

        var dx = 0;
        var dy = -cellSize * 3; // Reposition

        if (blocks.trashStacks.length === 0) {
            console.debug('Trash is empty--nothing to do');
            return;
        }

        var thisBlock = blocks.trashStacks.pop();

        // Restore drag group in trash
        blocks.findDragGroup(thisBlock);
        for (var b = 0; b < blocks.dragGroup.length; b++) {
            var blk = blocks.dragGroup[b];
            // console.debug('Restoring ' + blocks.blockList[blk].name + ' from the trash.');
            blocks.blockList[blk].trash = false;
            blocks.moveBlockRelative(blk, dx, dy);
            blocks.blockList[blk].show();
        }

        blocks.raiseStackToTop(thisBlock);

        if (blocks.blockList[thisBlock].name === 'start' || blocks.blockList[thisBlock].name === 'drum') {
            var turtle = blocks.blockList[thisBlock].value;
            turtles.turtleList[turtle].trash = false;
            turtles.turtleList[turtle].container.visible = true;
        } else if (blocks.blockList[thisBlock].name === 'action') {
            // We need to add a palette entry for this action.
            // But first we need to ensure we have a unqiue name,
            // as the name could have been taken in the interim.
            var actionArg = blocks.blockList[blocks.blockList[thisBlock].connections[1]];
            if (actionArg != null) {
                var oldName = actionArg.value;
                // Mark the action block as still being in the
                // trash so that its name won't be considered when
                // looking for a unique name.
                blocks.blockList[thisBlock].trash = true;
                var uniqueName = blocks.findUniqueActionName(oldName);
                blocks.blockList[thisBlock].trash = false;

                if (uniqueName !== actionArg) {
                    console.debug('renaming action when restoring from trash. old name: ' + oldName + ' unique name: ' + uniqueName);

                    actionArg.value = uniqueName;

                    var label = actionArg.value.toString();
                    if (label.length > 8) {
                        label = label.substr(0, 7) + '...';
                    }
                    actionArg.text.text = label;

                    if (actionArg.label != null) {
                        actionArg.label.value = uniqueName;
                    }

                    actionArg.container.updateCache();

                    // Check the drag group to ensure any do
                    // blocks are updated (in case of recursion).
                    for (var b = 0; b < blocks.dragGroup.length; b++) {
                        var me = blocks.blockList[blocks.dragGroup[b]];
                        if (['nameddo', 'nameddoArg', 'namedcalc', 'namedcalcArg'].indexOf(me.name) !== -1 && me.privateData === oldName) {
                            console.debug('reassigning nameddo to ' + uniqueName);
                            me.privateData = uniqueName;
                            me.value = uniqueName;

                            var label = me.value.toString();
                            if (label.length > 8) {
                                label = label.substr(0, 7) + '...';
                            }
                            me.text.text = label;
                            me.overrideName = label;
                            me.regenerateArtwork();
                            me.container.updateCache();
                        }
                    }
                }

                var actionName = actionArg.value;
                if (actionName !== _('action')) {
                    // blocks.checkPaletteEntries('action');
                    console.debug('FIXME: Check for unique action name here');
                }
            }
        }

        blocks.refreshCanvas();
    };

    /*
     * Hides aux menu
     */
    hideAuxMenu = function () {
        if (toolbarHeight > 0) {
            _showHideAuxMenu(false);
            menuButtonsVisible = false;
        }
    };

    /*
     * Sets up a new "clean" MB i.e. new project instance
     */
    _afterDelete = function () {
        toolbar.closeAuxToolbar(_showHideAuxMenu);
        sendAllToTrash(true, false);
        if (planet !== undefined) {
            planet.initialiseNewProject.bind(planet);
        }
    };


    // function _doPlaybackBox() {
    //     // _hideBoxes();
    //     // playbackBox.init(turtleBlocksScale, playbackButton.x - 27, playbackButton.y, _makeButton, logo);
    // };

    /*
     * @param {boolean} addStartBlock {if true adds a new start block to new project instance}
     * @param {boolean} doNotSave     {if true discards any changes to project}
     *
     * Hide the palettes before update.
     * Then deletes everything/sends all to trash
     */
    sendAllToTrash = function (addStartBlock, doNotSave) {
        // Return to home position after loading new blocks.
        blocksContainer.x = 0;
        blocksContainer.y = 0;
        for (var name in blocks.palettes.dict) {
            blocks.palettes.dict[name].hideMenu(true);
        }

        hideDOMLabel();
        refreshCanvas();

        var actionBlockCounter = 0;
        var dx = 0;
        var dy = cellSize * 3;
        for (var blk in blocks.blockList) {
            // If this block is at the top of a stack, push it
            // onto the trashStacks list.
            if (blocks.blockList[blk].connections[0] == null) {
                blocks.trashStacks.push(blk);
            }

            if (blocks.blockList[blk].name === 'start' || blocks.blockList[blk].name === 'drum') {
                console.debug('start blk ' + blk + ' value is ' + blocks.blockList[blk].value)
                var turtle = blocks.blockList[blk].value;
                if (!blocks.blockList[blk].trash && turtle != null) {
                    console.debug('sending turtle ' + turtle + ' to trash');
                    turtles.turtleList[turtle].trash = true;
                    turtles.turtleList[turtle].container.visible = false;
                }
            } else if (blocks.blockList[blk].name === 'action') {
                if (!blocks.blockList[blk].trash) {
                    blocks.deleteActionBlock(blocks.blockList[blk]);
                    actionBlockCounter += 1;
                }
            }

            blocks.blockList[blk].trash = true;
            blocks.moveBlockRelative(blk, dx, dy);
            blocks.blockList[blk].hide();
        }

        if (addStartBlock) {
            console.debug('ADDING START BLOCK');
            logo.playbackQueue = {};
            blocks.loadNewBlocks(DATAOBJS);
            setPlaybackStatus();
            _allClear(false);
        } else if (!doNotSave) {
            // Overwrite session data too.
            saveLocally();
        }

        // Wait for palette to clear (#891)
        // We really need to signal when each palette item is deleted
        setTimeout(function () {
            stage.dispatchEvent('trashsignal');
        }, 100 * actionBlockCounter); // 1000

        update = true;
    };

    // function _changePaletteVisibility() {
    //     if (palettes.visible) {
    //         palettes.hide();
    //     } else {
    //         palettes.show();
    //         palettes.bringToTop();
    //     }
    // };

    /*
     * Toggles block/palette visibility
     */
    _changeBlockVisibility = function () {
        hideDOMLabel();

        if (blocks.visible) {
            logo.hideBlocks();
            palettes.hide();
            hideBlocksContainer[1].visible = true;
            hideBlocksContainer[0].visible = false;
        } else {
            if (chartBitmap != null) {
                stage.removeChild(chartBitmap);
                chartBitmap = null;
            }
            hideBlocksContainer[1].visible = false;
            hideBlocksContainer[0].visible = true;
            logo.showBlocks();
            palettes.show();
            palettes.bringToTop();
        }

        // Combine block and palette visibility into one button.
        // _changePaletteVisibility();
    };

    /*
     * Toggles collapsible stacks (if collapsed stacks expand and vice versa)
     */
    _toggleCollapsibleStacks = function () {
        hideDOMLabel();

        if (blocks.visible) {
            blocks.toggleCollapsibles();
        }
    };

    /*
     * When turtle stops running restore stop button to normal state
     */
    this.onStopTurtle = function () {
        // TODO: plugin support
        /*
        if (stopTurtleContainer === null) {
            return;
        }

        if (stopTurtleContainer.visible) {
            _hideStopButton();
            setPlaybackStatus();
        }
        */
    };

    /*
     * When turtle starts running change stop button to running state
     */
    this.onRunTurtle = function () {
        // TODO: plugin support
        // If the stop button is hidden, show it.
        /*
        if (stopTurtleContainer === null) {
            return;
        }

        if (!stopTurtleContainer.visible) {
            _showStopButton();
        }
        */
    };

    /*
     * Updates all canvas elements
     */
    function refreshCanvas() {
        update = true;
    };

    /*
     * This set makes it so the stage only re-renders when an
     * event handler indicates a change has happened.
     */
    this.__tick = function (event) {

        if (update || createjs.Tween.hasActiveTweens()) {
            update = false; // Only update once
            stage.update(event);
        }
    };

    /*
     * Opens samples on planet after closing all sub menus
     */
    _doOpenSamples = function () {
        toolbar.closeAuxToolbar(_showHideAuxMenu);
        planet.openPlanet();
    };

    /*
     * Saves project
     * If beginner, assigns default "My Project" title to html file
     * If advanced, assigns custom title to html file
     */
    this.doSave = function () {
        toolbar.closeAuxToolbar(_showHideAuxMenu);
        if (beginnerMode) {
            save.saveHTML(_('My Project'));
        }
    };

    /*
     * Uploads MB file to Planet
     */
    doUploadToPlanet = function () {
        planet.openPlanet();
    };

    // function doShareOnFacebook() {
    //     alert('Facebook Sharing : disabled'); // remove when add fb share link
    //     // add code for facebook share link
    // };

    /*
     * @param merge {if specified the selected file's blocks merge into current project}
     *  Loads/merges existing MB file
     */
    doLoad = function (merge) {
        toolbar.closeAuxToolbar(_showHideAuxMenu);
        if (merge === undefined) {
            merge = false;
        }

        if (merge) {
            console.debug('MERGE LOAD');
            merging = true;
        } else {
            console.debug('LOAD NEW');
            merging = false;
        }

        console.debug('Loading .tb file');
        document.querySelector('#myOpenFile').focus();
        document.querySelector('#myOpenFile').click();
        window.scroll(0, 0);
        that.doHardStopButton();
        console.debug('Calling all clear from doLoad');
        _allClear(true);
    };

    window.prepareExport = prepareExport;

    /*
     * @param env {specifies environment}
     * Runs music blocks project
     */
    this.runProject = function (env) {
        console.debug('Running Project from Event');
        document.removeEventListener('finishedLoading', this.runProject);
        setTimeout(function () {
            console.debug('Run');
            _changeBlockVisibility();
            that._doFastButton(env);
        }, 5000);
    }

    /*
     * @param  projectID {Planet project ID}
     * @param  flags     {parameteres}
     * @param  env       {specifies environment}
     *
     * Loads MB project from Planet
     */
    this.loadProject = function (projectID, flags, env) {
        console.debug('LOAD PROJECT');
        if (planet === undefined) {
            console.debug('CANNOT ACCESS PLANET');
            return;
        }

        //set default value of run
        flags = typeof flags !== 'undefined' ? flags : {
            run: false,
            show: false,
            collapse: false
        };
        loading = true;
        document.body.style.cursor = 'wait';
        doLoadAnimation();

        // palettes.updatePalettes();
        setTimeout(function () {
            try {
                planet.openProjectFromPlanet(projectID, function () {
                    that.loadStartWrapper(that._loadStart);
                });
            } catch (e) {
                console.debug(e);
                console.debug('that._loadStart on error');
                that.loadStartWrapper(that._loadStart);
            }

            planet.initialiseNewProject();
            // Restore default cursor
            loading = false;

            document.body.style.cursor = 'default';
            update = true;
        }, 2500);

        var run = flags.run;
        var show = flags.show;
        var collapse = flags.collapse;

        var __functionload = function () {
            setTimeout(function () {
                if (!collapse && firstRun) {
                    _toggleCollapsibleStacks();
                }

                if (run && firstRun) {
                    for (var turtle = 0; turtle < turtles.turtleList.length; turtle++) {
                        turtles.turtleList[turtle].doClear(true, true, false);
                    }

                    textMsg(_('Click the run button to run the project.'));
                    // that.runProject(env);

                    if (show) {
                        _changeBlockVisibility();
                    }

                    if (!collapse) {
                        _toggleCollapsibleStacks();
                    }
                } else if (!show) {
                    _changeBlockVisibility();
                }

                document.removeEventListener('finishedLoading', __functionload);
                firstRun = false;
            }, 1000);
        }

        if (document.addEventListener) {
            document.addEventListener('finishedLoading', __functionload, false);
        } else {
            document.attachEvent('finishedLoading', __functionload);
        }
    };

    /*
     * Calculate time such that no matter how long it takes to
     * load the program, the loading animation will cycle at least
     * once.
     *
     * @param loadProject all params are from load project function
     */
    this.loadStartWrapper = async function (func, arg1, arg2, arg3) {
        var time1 = new Date();
        await func(arg1, arg2, arg3);

        var time2 = new Date();
        var elapsedTime = time2.getTime() - time1.getTime();
        var timeLeft = Math.max(6000 - elapsedTime);
        setTimeout(that.showContents, timeLeft);
    };

    /*
     * Hides the loading animation and unhides the background.
     * Shows contents of MB after loading screen.
     */
    this.showContents = function () {
        docById('loading-image-container').style.display = 'none';
        // docById('canvas').style.display = 'none';
        docById('hideContents').style.display = 'block';

        /*
        // Warn the user -- chrome only -- if the browser level is
        // not set to 100%
        if (window.innerWidth !== window.outerWidth) {
            blocks.errorMsg(_('Please set browser zoom level to 100%'));
            console.debug('zoom level is not 100%: ' + window.innerWidth + ' !== ' + window.outerWidth);
        }
        */
    };

    this._loadStart = async function () {
        console.debug('LOAD START');

        // where to put this?
        // palettes.updatePalettes();
        justLoadStart = function () {
            console.debug('Loading start');
            logo.playbackQueue = {};
            blocks.loadNewBlocks(DATAOBJS);
            setPlaybackStatus();
        };

        sessionData = null;

        // Try restarting where we were when we hit save.
        if (planet) {
            sessionData = await planet.openCurrentProject();
        } else {
            var currentProject = storage.currentProject;
            sessionData = storage['SESSION' + currentProject];
        }

        var __afterLoad = function () {
            if (!turtles.running()) {
                setTimeout(function () {
                    console.debug('reset turtles after load: ' + turtles.turtleList.length);

                    for (var turtle = 0; turtle < turtles.turtleList.length; turtle++) {
                        logo.turtleHeaps[turtle] = [];
                        logo.notationStaging[turtle] = [];
                        logo.notationDrumStaging[turtle] = [];
                        turtles.turtleList[turtle].doClear(true, true, false);
                    }
                    const imgUrl = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+IDxzdmcgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaWQ9InN2ZzExMjEiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDM0LjEzMTI0OSAxNC41NTIwODkiIGhlaWdodD0iNTUuMDAwMDE5IiB3aWR0aD0iMTI5Ij4gPGRlZnMgaWQ9ImRlZnMxMTE1Ij4gPGNsaXBQYXRoIGlkPSJjbGlwUGF0aDQzMzciIGNsaXBQYXRoVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4gPHJlY3QgeT0iNTUyIiB4PSI1ODgiIGhlaWdodD0iMTQzNiIgd2lkdGg9IjE5MDAiIGlkPSJyZWN0NDMzOSIgc3R5bGU9ImZpbGw6I2EzYjVjNDtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MTU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiIC8+IDwvY2xpcFBhdGg+IDwvZGVmcz4gPG1ldGFkYXRhIGlkPSJtZXRhZGF0YTExMTgiPiA8cmRmOlJERj4gPGNjOldvcmsgcmRmOmFib3V0PSIiPiA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4gPGRjOnR5cGUgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4gPGRjOnRpdGxlPjwvZGM6dGl0bGU+IDwvY2M6V29yaz4gPC9yZGY6UkRGPiA8L21ldGFkYXRhPiA8ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLjA4Njc4MiwwLDAsMS4wODY3ODIsLTEuNTQ3MzI0NSwtMS4zMDU3OTkpIiBpZD0iZzE4MTIiPiA8ZWxsaXBzZSB0cmFuc2Zvcm09Im1hdHJpeCgwLjAxMDQ2MDk5LDAsMCwwLjAxMDQ2MDk5LDEuMDE2NzM4OSwtNi4yMDQ4NTI5KSIgY2xpcC1wYXRoPSJ1cmwoI2NsaXBQYXRoNDMzNykiIHJ5PSI3NjgiIHJ4PSI3NDgiIGN5PSIxNDc2IiBjeD0iMTU0MCIgaWQ9InBhdGg0MzMzIiBzdHlsZT0iZGlzcGxheTppbmxpbmU7ZmlsbDojYTNiNWM0O2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxNTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4gPGVsbGlwc2Ugcnk9IjEuNzgyNjg1OSIgcng9IjEuNjkzOTIxNiIgY3k9IjguODM0MzUzNCIgY3g9IjE2LjQ0NjczOSIgaWQ9InBhdGg0MjU2IiBzdHlsZT0iZGlzcGxheTppbmxpbmU7ZmlsbDojYzlkYWQ4O2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojYzlkYWQ4O3N0cm9rZS13aWR0aDowLjEwNDYwOTk7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiIC8+IDxwYXRoIGlkPSJwYXRoNDMyOCIgZD0ibSAxNy42MzAyNjYsMTMuNDg3MDkgMC4zMjU0NywwLjM5MjA0NCAwLjM0NzY2LDAuMjczNjkgMC4zMTA2NzYsMC4xMTA5NTUgMC4yMzY3MDUsLTAuMDUxNzggMC4xNDA1NDQsLTAuMTg0OTI2IDAuMTk5NzIsMC4wODEzNyAwLjE1NTMzOCwwLjA0NDM4IDAuNjEzOTU0LC0wLjQyMTYzMiAwLjQyMTYzMSwtMC4yNTE0OTkgYyAwLDAgMC44ODc2NDUsLTAuMDA3NCAxLjYwNTE1NywtMC41NTQ3NzcgMC43MTc1MTMsLTAuNTQ3MzgxIDAuNDk1NjAyLC0wLjY1MDkzOSAwLjQ5NTYwMiwtMC42NTA5MzkgbCAtMC4wMzY5OSwtMC40MjkwMjkgLTAuNTM5OTg0LC0wLjcxNzUxMyAtMC41NTQ3NzcsLTAuNTY5NTcxIC0wLjIyOTMwOSwtMC4xNDc5NDEgYyAwLDAgLTAuMDIyMTksLTAuMDQ0MzggLTAuMDczOTcsLTAuMDQ0MzggLTAuMDUxNzgsMCAtMC4yNDQxMDMsLTAuMDczOTcgLTAuNTE3NzkzLDAuMDQ0MzggLTAuMjczNjkxLDAuMTE4MzUzIC0wLjQ2NjAxNCwwLjE3MDEzMiAtMC44NDMyNjMsMC4zODQ2NDYgLTAuMzc3MjQ4LDAuMjE0NTE0IC0wLjcxMDExNSwwLjQyMTYzMSAtMC44MzU4NjUsMC40OTU2MDIgLTAuMTI1NzUsMC4wNzM5NyAtMC43NDcxLDAuNDI5MDI4IC0wLjc0NzEsMC40MjkwMjggbCAtMC4wOTYxNiwwLjY1ODMzNiB6IiBzdHlsZT0iZGlzcGxheTppbmxpbmU7ZmlsbDojZjhmOGY4O2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjAxMDQ2MDk5cHg7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW9wYWNpdHk6MSIgLz4gPHBhdGggaWQ9InBhdGg0MzMwIiBkPSJtIDE4LjA4MTQ4NSwxMy4xMTcyMzkgYyAwLDAgMS4wMTcyMDIsMC4yMTk4MDggMS40OTA2MTMsLTAuMTM1MjUgMC42ODI1NSwtMC42NzQwOTcgMS42NTU4OTMsLTEuMTU0NzMxIDEuODcwMzU1LC0xLjc0NTMwOCAwLjEwODI1NywtMC4yOTgxMTYgMC4wOTI2NSwtMC4zNzIzNzcgLTAuMDgwMTgsLTAuNjM3MTkxIC0wLjc4NDA4NSwtMS4xMTY5NTIzIC0yLjE4NjAyMywwLjQ4MzU2MyAtMi4xODYwMjMsMC40ODM1NjMgbCAtMS4yMjA1MTEsMS4wNDI5ODMgeiIgc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6I2M5ZGFkODtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC4wMTA0NjA5OXB4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1vcGFjaXR5OjEiIC8+IDxwYXRoIGlkPSJwYXRoNDI4MSIgZD0ibSAxOC45MjM2MzgsMTEuOTExMTY2IGMgMCwwIC0yLjI2MjA3MywwLjM2MDA3MyAtMS4yNDU4MDcsMS42MzE0MjYgMS4wMTYyNjgsMS4yNzEzNTQgMS4zMzE1OSwwLjQ2ODQxNSAxLjMzMTU5LDAuNDY4NDE1IDAsMCAwLjIzNzM2NCwwLjI4NDAyMSAwLjU1MDIyMSwtMC4wMTI4OSAwLjMxMjg1NywtMC4yOTY5MSAwLjgwMTY1NywtMC40ODY1NjMgMC44MDE2NTcsLTAuNDg2NTYzIDAsMCAwLjgzMzQxOSwtMC4wODE1OCAxLjcyODg1MSwtMC42NDAzNDUgMC44OTU0MzIsLTAuNTU4NzY5IDAuMDI1NDUsLTEuNDk0NjQ0IDAuMDI1NDUsLTEuNDk0NjQ0IDAsMCAtMC43MDQwMDIsLTAuOTE0MzA1IC0xLjE5MTE1OCwtMS4wNjIwMDQgLTAuNDg3MTU1LC0wLjE0NzY5OSAtMS4yNjAyMDYsLTAuMjA1OTYzIC0xLjI2MDIwNiwtMC4yMDU5NjMgeiIgc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6bm9uZTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6IzUwNTA1MDtzdHJva2Utd2lkdGg6MC4xMDQ2MDk5O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiIC8+IDxwYXRoIGlkPSJwYXRoNTkyNiIgZD0ibSAxNi44ODkxNjUsMy45OTA3MDY3IGMgLTAuMjA1OTI1LDAuMDA5MDIgLTAuNDkwNTg0LDAuMDE2NDUyIC0wLjY4MjQzNCwwLjA5NDMwNiAtMC4zNjM1MSwwLjExMzE2MjUgLTAuNzg0MDE5LDAuMzA2NTkxNiAtMS4xMDIwMzksMC40MTQ1MTk3IEMgMTQuODA1NzA3LDQuNjAwOTk5MyAxNC41MjgzODMsNC44Njc1ODQxIDE0LjQ0MjUxNSw0Ljc3MDc2NzYgMTQuMzE0ODUsNC42MjY4MjQ0IDE0LjIyNDM1Myw0LjU5NTM2MyAxNC4wNDU2ODksNC40OTc1NTkgMTMuODAxNzgxLDQuMzk5NTA1IDEzLjg3Mzc3Myw0LjQ0NDgyNzIgMTMuNjYwODY2LDQuMzg2MzI4MyAxMy41MTM2ODEsNC4zNDU4ODcxIDEzLjQ0ODI5LDQuMjg4Mjk1OCAxMy4wNDc5NTQsNC4zMDIzNTY3IGMgLTAuMjE2MDg3LDAuMDA3NTkgLTAuNDczNTEsMC4wMDgwNCAtMC42NjAwODEsMC4wODk3MjUgLTAuMzc0NjE1LDAuMTY0MDE3OCAtMC4yOTksMC4yNDg0NzU3IC0wLjUzODU3MiwwLjQ5MDAyNTIgLTAuMTY1MTA4LDAuMTY2NDcwOSAtMC4yMjMwMjksMC41NzQ5ODMxIC0wLjI4MjA0MSwwLjgxODg1OCAtMC4wNjkzOSwwLjI4Njc3NzYgLTAuMDU0NywwLjYwMTAzOTMgLTAuMDIwMzEsMC45Njc0MDMxIDAuMDI3NjEsMC4yOTQxOTY1IDAuMDkxNzMsMC40OTczOTM5IDAuMjQ5Mzg4LDAuNzU5MDYzIDAuMTM1MDg0LDAuMjI0MTk4OSAwLjMyNDU2MSwwLjI4MzU4MjggMC41NDY1OSwwLjQ5NzI4OTMgMC4wNzc3NCwwLjA3NDgzIDAuMzY4Mzk4LC0wLjAzODk2NSAwLjQ4NDg4LC0wLjAxNTEwNCAwLjEwODcwOSwwLjAyMjI3IC0wLjA0ODE3LDAuMjE2NzA4OCAtMC4wNTMyLDAuMjQ1MzgzNCAtMC4wNTM4LDAuMjM5NTE2OSAtMC4xMTA1MDMsMC4wODc3NzEgLTAuMDgwNiwwLjYyNzQyNjEgMC4zNDgxMjMsMi4wMjY2ODkyIDEuMDA1MDg5LC0xLjA2NzI2NDcgMC4zMjY2NDksMC42Njg2MTk0IC0wLjA1Mjk4LDAuMTM1NTY0IC0wLjQzNzU5NCwwLjM4ODgwNjggLTAuNTAzMzY4LDAuNTg2ODUzOCAtMC4wMTI2NywwLjE2NTEwOSAwLjE5NzgzNSwwLjE5NDA4IDAuMzE4OTk3LDAuMTc4MDQ5IDAuMDYyNjYsMC40ODAzOTUgMC4xMjQ5ODIsMS4wNDIwNDggMC41MjIyNDIsMS4zNzI0MzkgMC4xMjAxNzcsMC4xMDY0MDIgMC4yODY2NTIsMC4wOTQ0NyAwLjQyOTMxNywwLjEyNjQ0MyAwLjIyMTY0MSwwLjI2ODEyOCAwLjQ0ODY2OCwwLjU1NzA2NiAwLjc4NDA4NywwLjY4OTc3NCAwLjI4Mzg0NSwwLjE0ODQzNSAwLjYyNDkxMywwLjA1MSAwLjg5NjEzOCwwLjIzMzA2NSAwLjcxMjkyNSwwLjM2MDkwMSAxLjU5NDM3LDAuMjI3NDI0IDIuMjQwMzA3LC0wLjIxNDM2NyAwLjIzOTczNiwtMC4wMjU4NCAwLjUwMTI0MywwLjA1MTE5IDAuNzUxMzkxLDAuMDIyMjIgMC41NzU4OTgsLTAuMDIwMDYgMS4xNjcyMDcsLTAuMjQwMDA1IDEuNTIzOTYyLC0wLjcxMTUwMiAwLjA3MjksLTAuMDY2IDAuMTAyMDgxLC0wLjE3ODE0IDAuMTY4ODAzLC0wLjI0MDYzNSAwLjA2NjE2LDAuMDgzMyAwLjIwMTA3OSwwLjE2NTI4OSAwLjI4NTY1MywwLjA1NTAyIDAuMTkzMDcyLC0wLjI1MzQzNiAwLjIyMzQxMywtMC41OTUxMDQgMC4zMjcxNDUsLTAuODgyNTU5IDAuMDg2NTgsMC4wMzY0MSAwLjA4NDIsMC4yNjU3MzQgMC4xOTA4MiwwLjE3NTk2OCAwLjA4ODU4LC0wLjI3NzUxIDAuMjMxMDU1LC0wLjU4OTU1NCAwLjE1NzQ4NywtMC44NzUxMDMgQyAyMS4wOTQ5NjgsOS44NjQxNTE0IDIwLjk5NDc5OSw5LjcxMDk4NzkgMjAuOTU5NzUxLDkuNjcwOTkxNCAyMS4wNjk3Myw5LjY2NDkyMTQgMjEuMzkyMTQ2LDkuNjA3NDEyNCAyMS4zNjQyMjYsOS40MzQyNzkgMjEuMjg0OTAyLDkuMjY0MDY1MSAyMC45MzAzMjQsOS4wNTgwODkzIDIwLjc4MTQ3LDguOTYzNjg5MyAyMC42Mjc0ODksNy4wODIzNjI5IDIwLjgzMTk0MSw3Ljk3MzAwNDMgMjAuMzc0NDc1LDYuNTcyMTY2OCAyMC4yODY2OTMsNi4yOTYzNjYgMjAuMTc5NTgyLDYuMDI1MzkwOCAyMC4wMzkxNDksNS43NjczNzc4IDE5LjgxNDE1NSw1LjM1NDAwNzYgMTkuNTAzNjMsNC45NzM5MDc1IDE5LjA1MDAzMSw0LjY2MDUzMjggMTguNjk0MTU3LDQuNDg2NjE1NyAxOC43NzkxNjcsNC40MTI0NTc4IDE4LjQxNjMxOSw0LjI4NDIxMTggMTguMDQwOTE2LDQuMTE0ODkzIDE3LjkyMzEyNiw0LjExNDQyOTQgMTcuNzA2MjE3LDQuMDQ5NTUxNCAxNy40MjE5OTMsNC4wMDQyMzgyIDE3LjE3NjIyNiwzLjk5MzQ2MTEgMTYuODg5MTY1LDMuOTkwNzA2NyBaIG0gLTAuNDE2Nzc3LDMuNzcwMjM0NSBjIDAuMjU4MDA1LDAuMDA5NzYgMC40MjkyNTksMC4yNTQ4MTQgMC41Mjc1MDEsMC40Njg0NDEgLTAuMDQ2NTEsMC4xMjA5MTIzIC0wLjIxNzYxMywwLjE4MDMzMTggLTAuMzE0MzE2LDAuMjcwODAwNSAtMC4wNTIyNywwLjAzMDg5OCAtMC4xOTUwNTcsMC4xNDE5ODI5IC0wLjA3Mzk3LDAuMTc2MjU4MyAwLjE2NzU3NCwtMC4wMDgwMSAwLjM0MTEyNSwtMC4xMDE3NzYgMC41MDIzNjMsLTAuMDgxMjUzIDAuMDM4OCwwLjMxMzY5MjcgMC4wMTAzOCwwLjcyNTUwMzEgLTAuMjk1OTM5LDAuOTAyMTQ5NSAtMC4zMTY4ODQsMC4wODI4MjcgLTAuNTYyMDUzLC0wLjIxMjE0MTYgLTAuNjc2ODI5LC0wLjQ3MTYxOCAtMC4xNDcwOTYsLTAuMzY2NjkwMiAtMC4xODU5MzQsLTAuODQyODQzMSAwLjA3NjUxLC0xLjE2Njk5ODggMC4wNjUzMSwtMC4wNjgyNjggMC4xNjAwMTEsLTAuMTA2MzQ3NSAwLjI1NDY3OCwtMC4wOTc3OCB6IG0gMi44NTkyNDQsMi41NzU3ODc4IGMgLTAuMDc2NzMsMC4xODQ3NTggLTAuMjMwNjU5LDAuMzMwMTU2IC0wLjQwNzAxMSwwLjQxMzI1MiAtMC4wNTUzOSwwLjE1MDcwNSAwLjA0MDA0LDAuMzU0MzggMC4wMjk3LDAuNDgzMjM0IC0wLjA0OTA3LC0wLjE2MDM1NyAtMC4wMDE2LC0wLjM2MTQyNiAtMC4xMDg4NzUsLTAuNDk2NzU3IC0wLjA3MDE4LC0wLjAyMjcxIC0wLjE0Nzc0NywtMC4wMjgxIC0wLjIxMTc0MSwtMC4wNzIwNiAwLjIxMjc5NCwwLjExNzcxNyAwLjQ5NTYxLDAuMDM5MjQgMC42MDQ3NjYsLTAuMTgyMDk0IDAuMDI5MzQsLTAuMDM3NjIgMC4wODE1OSwtMC4xNDU1NzUgMC4wOTMxNiwtMC4xNDU1NzEgeiBtIC0wLjk2NTM3MiwwLjE0MTk4OCBjIDAuMDQ1NjYsMC4wMzQwOSAwLjIwNDg5NywwLjE2Mjg1NyAwLjA3NzQ0LDAuMDY3ODUgLTAuMDE2NDEsLTAuMDExMzggLTAuMDkwMTksLTAuMDcwODYgLTAuMDc3NDQsLTAuMDY3ODUgeiIgc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6I2M5ZGFkODtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC4wNTIzMDQ5NTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4gPHBhdGggaWQ9InBhdGg0MjU3IiBkPSJtIDE4LjU2MjI5Miw0LjM0MDY1NDMgYyAwLDAgLTAuMDE4MjMsLTAuMTI2MDkyNSAwLjA1NTAzLC0wLjI2MzA5MTEgMC4xMDcwNjUsLTAuMjAwMjExOCAwLjM2NDA0MywtMC40MDk5NDg1IDAuNjYxOTUxLC0wLjU5NjUyOTEgMC4zOTA1NzksLTAuMjQ0NjIwMiAwLjg3ODEwNSwtMC40MDE1NzcyIDEuNDU3NjUzLDAuMDM1OTg1IDAuMTUwMzMxLDAuMTEzNTAwOCAwLjI3NTEyLDAuMzU2MTg0OSAwLjQzNjUyLDAuNTQ2MjQ1OCAwLDAgMC40NDM4MjIsMC41MzI1ODcxIDAuMDU5MTgsMS43OTAwODI5IEMgMjAuODQ3OTc4LDcuMTEwODQ1IDIwLjI0MTQyLDYuNTMzODc1NCAyMC4yNDE0Miw2LjUzMzg3NTQgWiIgc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6I2M5ZGFkODtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC4wMTA0NjA5OXB4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1vcGFjaXR5OjEiIC8+IDxwYXRoIGlkPSJwYXRoNDI1OSIgZD0ibSAxNS41NDQ5NjIsNC4zMTU2Mjk4IGMgMC42NzQwMTYsMC44NjIwMTcgMi4yMjQ5NDUsMy4zNjQ2NDY3IDIuNTUyNDgxLDIuMTM1NzQ3MSAwLjIwOTIyLC0wLjkxMDEwNjEgMC4wMTUzMiwtMi4zMDI1OTczIDAuMDE1MzIsLTIuMzAyNTk3MyAwLDAgLTEuMjUyMDM4LC0wLjQ2NTg4NTcgLTIuNTY3ODAyLDAuMTY2ODUwMiB6IiBzdHlsZT0iZGlzcGxheTppbmxpbmU7ZmlsbDojODk5YmIwO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTojODk5YmIwO3N0cm9rZS13aWR0aDowLjEwNDYwOTk7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiIC8+IDxwYXRoIGlkPSJwYXRoNDI3NiIgZD0ibSAxNC41NTMyNiw5LjMxOTI1NjMgYyAwLDAgLTAuMTY3Mzc2LDAuMDUyMzA1IDEuMDk4NDA0LDAuMzM0NzUxNyAxLjI2NTc4LDAuMjgyNDQ2NyAxLjYyMTQ1MywtMC42Njk1MDM0IDEuNjIxNDUzLC0wLjY2OTUwMzQgMCwwIDEuMDM1NjM4LC0xLjUxNjg0MzYgMi4xNDQ1MDMsLTAuMzAzMzY4NyAwLDAgMC4yODI0NDcsMC4zMDMzNjg3IDAuNzg0NTc1LDAuMjkyOTA3NyAwLDAgMC4zMTM4MjksLTAuMTc3ODM2OCAwLjU3NTM1NCwtMC4wMTA0NjEgMC4yNjE1MjUsMC4xNjczNzU5IDAuNDkxNjY3LDAuMzI0MjkwNyAwLjQ5MTY2NywwLjMyNDI5MDcgMCwwIDAuMzg3MDU2LDAuMzY2MTM0NyAtMC4yOTI5MDgsMC4zNTU2NzM3IDAsMCAwLjQyODksMC4xMDQ2MDk5IC0wLjA4MzY5LDEuMzM5MDA3IGwgLTAuMTQ2NDU0LC0wLjMzNDc1MiBjIDAsMCAtMC4yMDkyMiwxLjQwMTc3MyAtMC41NzUzNTQsMC44NjgyNjIgMCwwIC0wLjE2ODU2NywwLjI4NDA0MiAtMC41NDkzMzUsMC41MzgxMTEgLTAuNDYxNzA0LDAuMzA4MDczIC0xLjIwMDYyLDAuNTc5MDM0IC0xLjg4Mjg0NiwwLjMzNTM4MiAwLDAgLTAuOTI5NDM2LDEuMDIzNTYzIC0yLjUxMjQwMiwwLjEyMTEyNSAwLDAgLTAuODcxNzI4LDAuMTY2NTUyIC0xLjQ1NzU0MywtMC44MTY3ODEgMCwwIC0wLjgwNTQ5NiwwLjE5ODc1OSAtMC45NTE5NSwtMS40OTU5MjIgMCwwIC0wLjY3OTk2NSwwLjA0MTg0IC0wLjA0MTg0LC0wLjU0Mzk3MSAwLjYzODEyLC0wLjU4NTgxNTUgMS4yMDMwMTQsLTAuNDYwMjgzNiAxLjIwMzAxNCwtMC40NjAyODM2IHoiIHN0eWxlPSJkaXNwbGF5OmlubGluZTtmaWxsOiNmOGY4Zjg7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuMDEwNDYwOTlweDtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2Utb3BhY2l0eToxIiAvPiA8cGF0aCBpZD0icGF0aDQzNjUiIGQ9Im0gMTMuNTM4NTQ0LDUuMzE3OTI3NiBjIC0wLjAxNjk4LDAuMDAzMzMgLTAuMjk1NDI5LDAuMDA0MTEgLTAuNTQyNjE0LC0wLjEyODc4OTQgLTAuMTI2Mjk4LC0wLjA2NzkwNiAtMC4yNDcwMjYsLTAuMTI3MDA2OSAtMC4yOTEyNywtMC4xODU5ODA3IC0wLjAzNTY0LC0wLjA0NzUwOCAwLjAwNDEsLTAuMTExNDU4NyAtMC4wNjY4NSwtMC4wNTMwMjIgLTAuOTQ5ODUyLDAuNzgyODExNiAtMC40ODU4NjcsMi4wNDg5MTU3IDAuMzkxNTE4LDIuMzgxNzQ5OSAwLDAgMC4xNjgwMywtMC45MzA1MDIgMS4wODQ1NzEsLTEuOTg3ODA1NyIgc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6I2Y4ZjhmODtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC4wMTA0NjA5OTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4gPHBhdGggaWQ9InBhdGg0MzY3IiBkPSJtIDE4Ljk2OTEyOSw0LjU1MTQ2OTcgYyAwLDAgMC45NjE2MTUsMC42ODA1MjcxIDEuMTk4MzIsMS42MTI1NTQzIDAsMCAxLjE1MzkzOSwtMS43MzA5MDY4IC0wLjA3Mzk3LC0yLjQyNjIyODIgMCwwIC0wLjIwNzExOCwwLjc5ODg4IC0xLjEyNDM1MSwwLjgxMzY3MzkgeiIgc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6I2Y4ZjhmODtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC4wMTA0NjA5OXB4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1vcGFjaXR5OjEiIC8+IDxwYXRoIGlkPSJwYXRoNDIxNSIgZD0ibSAxMi44Mzg2ODUsMTAuMjA5MDE4IGMgMC4xNDQzOTksMS43NjE2ODIgMC45Mzg2MDEsMS40NzI4ODIgMC45Mzg2MDEsMS40NzI4ODIgMC42MzUzNiwxLjAxMDggMS40Mjk1NjEsMC44MjMwOCAxLjQyOTU2MSwwLjgyMzA4IDEuMzcxODAyLDAuODM3NTIyIDIuNTI3MDAzLC0wLjEwMTA3OSAyLjUyNzAwMywtMC4xMDEwNzkgMS45MzQ5NjMsMC4zMTc2OCAyLjQxMTQ4MywtMC45MjQxNjIgMi40MTE0ODMsLTAuOTI0MTYyIDAuMzc1NDQxLDAuNTc3NjAxIDAuNjA2NDgxLC0wLjgwODY0MSAwLjYwNjQ4MSwtMC44MDg2NDEgMC4wNTc3NiwtMC4xMTU1MiAwLjE0NDQwMSwwLjM0NjU2IDAuMTQ0NDAxLDAuMzQ2NTYgMC40NjIwNzksLTEuMjEyOTYwNSAwLjA4MzI0LC0xLjM3NzgzMyAwLjA4MzI0LC0xLjM3NzgzMyAxLjAxMDgwMSwwLjAyODg4IC0wLjIwMzYyNiwtMC43MDI4NzQgLTAuMjAzNjI2LC0wLjcwMjg3NCAtMC4wMjU1MywtMS4wNTkwNjU0IC0wLjAyNTA4LC0xLjMyOTIxMzEgLTAuMzkwMDU0LC0yLjMzMzQzNzggMC44MDk3OTcsMC4yMTYzODc3IDAuODExMDU3LC0wLjk2MDY1ODkgMC45NDkxNywtMS4yMjk3ODc3IDAuMTk5OTE5LC0wLjUzOTAyNDUgLTAuMDM1NiwtMS41MDQ0OTA0IC0wLjY3OTY0MSwtMS45MTk1MzIzIC0wLjI2NTQxMSwtMC4xNzEwMzg3IC0wLjYwMDIsLTAuMjQ4NjAwOSAtMS4wMDI0ODYsLTAuMTY0MzE5OCAtMC4zMDI3NTUsMC4xMzkwMTI4IC0wLjY5MjU0LDAuMzk0OTg5NSAtMC45MDc2MjgsMC42MDg2NjE5IC0wLjE5MzYxMywwLjE5MjMzOTUgLTAuMjE5NjQ5LDAuMzAzMjExNCAtMC4xOTU0NDIsMC40MTU1NTciIHN0eWxlPSJmaWxsOm5vbmU7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiM1MDUwNTA7c3Ryb2tlLXdpZHRoOjAuMTA0NjA5OTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4gPHBhdGggaWQ9InBhdGg0MjI3IiBkPSJtIDEyLjgzODY4NSwxMC4yMTE0OTUgYyAwLDAgLTAuOTA5NzIxLDAuMDk4NiAwLjI1OTkyLC0wLjgxMTExNzkgMCwwIDAuNDkwOTYsLTAuNDE4NzYwOCAxLjQ3Mjg4MSwtMC4wNTc3NiIgc3R5bGU9ImZpbGw6bm9uZTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6IzUwNTA1MDtzdHJva2Utd2lkdGg6MC4xMDQ2MDk5O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiAvPiA8cGF0aCBpZD0icGF0aDQyMjkiIGQ9Ik0gMTIuOTA0OTA0LDkuNTY1NTUzIEMgMTIuNTA1NjUzLDguNzczODU0OCAxMi42NzA3OTcsOC4xNjU2MDM3IDEyLjg1MDI0NCw3Ljk1ODI5NCIgc3R5bGU9ImZpbGw6bm9uZTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6IzUwNTA1MDtzdHJva2Utd2lkdGg6MC4xMDQ2MDk5O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiAvPiA8cGF0aCBpZD0icGF0aDQyMDEiIGQ9Im0gMTQuNTgxMzAzLDQuODIyNzY5MiBjIDAsMCAxLjc5NTc0OSwtMS40NTE3MDY2IDMuOTY3MjA3LC0wLjUxNTAzMDkiIHN0eWxlPSJkaXNwbGF5OmlubGluZTtmaWxsOm5vbmU7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiM1MDUwNTA7c3Ryb2tlLXdpZHRoOjAuMTA0NjA5OTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4gPHBhdGggc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6bm9uZTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6IzUwNTA1MDtzdHJva2Utd2lkdGg6MC4xMDQ2MDk5O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiBkPSJNIDEyLjkxMzUyNyw3Ljg5OTY1ODEgQyAxMC44OTQzNTYsOC4zNTIwMTQzIDExLjE2ODQwMiw0LjI1NDUyNDcgMTIuNzY0OTUyLDQuMzAyNTA3MyAxMy4zODM1NjksNC4yODU3MzczIDE0LjA5NzQyNCw0LjI2Nzg1NSAxNC42NTY4MSw1LjAwMTUxMyIgaWQ9InBhdGg0MjA3IiAvPiA8cGF0aCBpZD0icGF0aDQyMzMiIGQ9Im0gMTguMzQwMzMxLDEwLjQ1NDQ5OSBjIDAsMCAwLjY2NDI0LDAuNzIyIDEuMDEwODAxLC0wLjE3MzI4IiBzdHlsZT0iZGlzcGxheTppbmxpbmU7ZmlsbDpub25lO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTojNTA1MDUwO3N0cm9rZS13aWR0aDowLjEwNDYwOTk7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiIC8+IDxwYXRoIGlkPSJwYXRoNDIzNSIgZD0ibSAxOC44ODkwNTIsMTAuNzI4ODU5IDAuMDcyMiwwLjU2MzE2IiBzdHlsZT0iZGlzcGxheTppbmxpbmU7ZmlsbDpub25lO2ZpbGwtcnVsZTpldmVub2RkO3N0cm9rZTojNTA1MDUwO3N0cm9rZS13aWR0aDowLjEwNDYwOTk7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjEiIC8+IDxwYXRoIGlkPSJwYXRoNDI1MSIgZD0ibSAxNC4xMzQ4Miw1LjM0NDA4MDEgYyAtMC4xNzgzOTEsMCAtMC42MzI5NDYsMC4wMDY5OCAtMC45OTQxOTIsLTAuMDg2ODE2IEMgMTIuOTA4NzMsNS4xOTcwNTE5IDEyLjcxNTI4NCw1LjA5NTMxMjUgMTIuNjU4MDI2LDQuOTIzNTM3OCIgc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6bm9uZTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6IzUwNTA1MDtzdHJva2Utd2lkdGg6MC4xMDQ2MDk5O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiAvPiA8cGF0aCBpZD0icGF0aDQzMDEiIGQ9Im0gMTIuNjcyOTA2LDExLjI0OTk1OSBjIDAsMCAtMS4yMTMxMTMsMC44ODAyNDcgLTAuNzI0OTA5LDEuNTQ1OTgxIGwgMC41OTkxNiwwLjUzMjU4NiAwLjgyMTA3MiwwLjQ0MzgyMyAxLjIyNzkwNywwLjA2NjU3IDAuODA2Mjc3LC0wLjE0Nzk0MSAwLjQxNDIzNCwtMC4xODQ5MjYgMC40NDM4MjIsMC4zNzcyNSAwLjM5OTQ0MSwwLjAxNDc5IDAuMjI5MzA4LC0wLjExMDk1NiAwLjY4NzkyNCwtMC4yNzM2OTEgMC4zNjI0NTYsLTAuMjg0Nzg2IDAuMjA3MTE3LC0wLjMxNDM3MyAtMC4wMjk1OSwtMC4zNDAyNjQgYyAwLDAgLTAuMzg0NjQ2LC0xLjE2MTMzNSAtMC43OTg4OCwtMS4zNDYyNjEgMCwwIC0wLjUzMjU4NywtMC41NzY5NjkgLTEuMjcyMjkxLC0wLjA4MTM3IDAsMCAtMS4xMTY5NTIsMC4zNjk4NTIgLTIuMDg1OTY0LDAuMDQ0MzggLTAuOTY5MDEyLC0wLjMyNTQ3IC0xLjI4NzA4NSwwLjA1OTE4IC0xLjI4NzA4NSwwLjA1OTE4IHoiIHN0eWxlPSJkaXNwbGF5OmlubGluZTtmaWxsOiNmOGY4Zjg7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuMDEwNDYwOTlweDtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2Utb3BhY2l0eToxIiAvPiA8cGF0aCBpZD0icGF0aDQzMjUiIGQ9Im0gMTEuODUzMTgsMTIuNDgxMDk0IGMgMCwwIDEuMjIwNTExLC0wLjcwMjcxOSAzLjA2OTc3LC0wLjE4NDkyNyAwLDAgMC45MTcyMzQsMC4xNjI3MzYgMS41MDg5OTYsLTAuMDY2NTcgMC41OTE3NjQsLTAuMjI5MzA5IDAuNzkxNDgzLDAuMjczNjkgMC43OTE0ODMsMC4yNzM2OSAwLDAgMC40NjYwMTQsMC44NDMyNjIgMC4zOTk0NCwwLjkwMjQzOCBsIDAuMTc3NTI5LC0wLjA1MTc4IDAuMjY2MjkzLC0wLjM0MDI2NCAwLjA3Mzk3LC0wLjI1ODg5NyAtMC4xNDA1NDMsLTAuNDI5MDI4IC0wLjI3MzY5MSwtMC41NzY5NjggLTAuMzEwNjc2LC0wLjQ0MzgyMiAtMC4yNTE0OTksLTAuMTg0OTI3IC0wLjQyMTYzMSwtMC4xODQ5MjUgLTAuNDA2ODM4LDAuMDI5NTkgLTAuNjA2NTU2LDAuMjUxNDk5IGMgMCwwIC0xLjAyODE4OSwwLjI4ODQ4NSAtMi4yNDg3LC0wLjE4NDkyNSAwLDAgLTAuOTAyNDM4LC0wLjE2MjczNiAtMS41MTYzOTIsMC45ODM4MDYgbCAtMC4xMTgzNTMsMC4zOTk0MzkgeiIgc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6I2M5ZGFkODtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC4wMTA0NjA5OXB4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1vcGFjaXR5OjEiIC8+IDxwYXRoIGlkPSJwYXRoNDI3OSIgZD0ibSAxNi44MzM2NzIsMTMuNzg1MjE3IGMgMC4xNTM0MjMsLTAuMTAyOTY3IDEuNDU0MTIyLC0wLjQwNTE0NCAxLjI3MTUzLC0xLjEwNzA1MiAtMC4xODI1OSwtMC43MDE5MDYgLTAuODEwNDg4LC0yLjE4MzA4IC0xLjk2Mjc0OSwtMS42MjExNTEgLTEuMTUyMjY0LDAuNTYxOTMyIC0yLjQyODI3MSwwLjA0NDIyIC0yLjQyODI3MSwwLjA0NDIyIDAsMCAtMC41MDI1NzUsLTAuMTkxMTk4IC0wLjkxNzEzNywwLjA0NDc1IC0wLjQxNDU2MiwwLjIzNTk1MSAtMC44MzU2OTEsMC42MjQyODUgLTAuOTY5NjcsMS4yNjM4MzYgLTAuMTMzOTgyLDAuNjM5NTU3IDEuNTU5NzQ1LDEuMzQxOTkxIDEuNTU5NzQ1LDEuMzQxOTkxIDAsMCAxLjYyODU2NywwLjIzODgxMyAyLjM5NTY5MywtMC4yNzYwMzUgMCwwIDAuNjI5NzI5LDAuNjk3NzcxIDEuMDUwODU5LDAuMzA5NDM3IHoiIHN0eWxlPSJkaXNwbGF5OmlubGluZTtmaWxsOm5vbmU7ZmlsbC1vcGFjaXR5OjE7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiM1MDUwNTA7c3Ryb2tlLXdpZHRoOjAuMTA0NjA5OTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4gPHBhdGggZD0ibSAxNy4xMTQwMTYsOC41MDk4MjQxIGEgMC45NDk4OTcwOCwwLjU4NjQwNTg3IDc4LjA3ODA2MiAwIDEgLTAuMzQwNjEzLDEuMDQwNjk1NSAwLjk0OTg5NzA4LDAuNTg2NDA1ODcgNzguMDc4MDYyIDAgMSAtMC43NzY1NjIsLTAuNjc4NzU2IDAuOTQ5ODk3MDgsMC41ODY0MDU4NyA3OC4wNzgwNjIgMCAxIDAuMjM5NTYsLTEuMTI5MDIxNiAwLjk0OTg5NzA4LDAuNTg2NDA1ODcgNzguMDc4MDYyIDAgMSAwLjgwNzczNiwwLjUzMTgzNzIgbCAtMC41MDM4NzgsMC4zNTYzODM5IHoiIGlkPSJwYXRoNDI2NSIgc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6IzUwNTA1MDtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6MC4xMDQ2MDk5NDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZSIgLz4gPHBhdGggZD0iTSAyMC40MTM5NzcsOC4wMzE1OTA2IEEgMC44NTY3NjMyNSwwLjUyODkxMDk1IDc4LjA3ODA2MiAwIDEgMjAuMTA2NzYsOC45NzAyNDk4IDAuODU2NzYzMjUsMC41Mjg5MTA5NSA3OC4wNzgwNjIgMCAxIDE5LjQwNjMzNiw4LjM1ODA0MzEgMC44NTY3NjMyNSwwLjUyODkxMDk1IDc4LjA3ODA2MiAwIDEgMTkuNjIyNDA3LDcuMzM5NzE3NiAwLjg1Njc2MzI1LDAuNTI4OTEwOTUgNzguMDc4MDYyIDAgMSAyMC4zNTA5NDgsNy44MTk0MTA4IGwgLTAuNDU0NDc0LDAuMzIxNDQxNiB6IiBpZD0icGF0aDQyNjUtMiIgc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6IzUwNTA1MDtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6MC4xMDQ2MDk5NDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZSIgLz4gPHBhdGggaWQ9InBhdGg1NzIwIiBkPSJtIDIxLjEzNDgzMiw3LjY5NjM2MzQgYyAtMC4xMTIzMTgsLTAuMDI3NzU3IC0wLjI2MjQ5NywtMC4wODEwNTQgLTAuMzMzNzMxLC0wLjExODQzODMgLTAuMTQ0MDA1LC0wLjA3NTU3MyAtMC4yOTkzMjksLTAuMjY5ODY1MyAtMC4yOTkzMjksLTAuMzc0NDI2IDAsLTAuMDk2NjA3IC0wLjE5MzI5OCwtMC44NDY4MTQgLTAuMjk0MTMzLC0xLjE0MTU1OTcgQyAxOS45MTc4NSw1LjIxNDg4MjcgMTkuNDI2NzM2LDQuNjc1ODIwNSAxOC44MDY4MDgsNC41MjQzNDIzIDE4LjU3NDU0Myw0LjQ2NzU4OTMgMTguMzc3OTYsNC4zNzc3MTcyIDE4LjM3Nzk2LDQuMzI4Mjg1MSBjIDAsLTAuMTE2NTg3NCAwLjUxODc4NywtMC4zNzIwNTkgMC43NTU1ODcsLTAuMzcyMDgxOCAwLjIyNTEyOSwtMi4wOWUtNSAwLjU1MTc3MywwLjE5NTUxMDUgMC43NTQwMDcsMC40NTEzNTU2IDAuMDg5NTgsMC4xMTMzMjYgMC4zMzY4NDMsMC41NTg3ODc0IDAuNTQ5NDc2LDAuOTg5OTE0MSAwLjYzMDg5MSwxLjI3OTE3MTkgMS4xMjc0NjQsMS45Njg0NzM4IDEuNTY3NTYzLDIuMTc1OTYzMyAwLjIxNzMwOCwwLjEwMjQ1MTggMC4yMjYxMTYsMC4xMTE5NDIgMC4xMzA4ODEsMC4xNDEwMjE1IC0wLjE1OTgzNSwwLjA0ODgwNCAtMC43NzQ5NSwwLjAzNzY4MSAtMS4wMDA2NDIsLTAuMDE4MDk0IHoiIHN0eWxlPSJmaWxsOiMwMDAwMDA7ZmlsbC1vcGFjaXR5OjA7c3Ryb2tlLXdpZHRoOjAuMDUyMzA0OTU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lIiAvPiA8cGF0aCBpZD0icGF0aDQyNDUiIGQ9Im0gMTUuNTQ0Mzg3LDQuMzE0MzcwOSBjIDAsMCAxLjU1NTIyNiwyLjEwODgwNTMgMi4wNzgyNzYsMi4yNzYxODExIDAuNTIzMDQ5LDAuMTY3Mzc1OSAwLjU1MDA5OSwtMS4yNjczOTM5IDAuNTUwMDk5LC0xLjI2NzM5MzkgMCwwIDAuMDEwNDYsLTAuODA1NDk2MiAtMC4wMzEzOCwtMS4xNjExNyIgc3R5bGU9ImZpbGw6bm9uZTtmaWxsLXJ1bGU6ZXZlbm9kZDtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC4xMDQ2MDk5O3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZTtzdHJva2Utb3BhY2l0eToxIiAvPiA8cGF0aCBpZD0icGF0aDQyNDkiIGQ9Im0gMTguOTQ0Mzc3LDQuNTQ1NjI2MiBjIDAuMjUwMTgyLDAuMDI5NjUgMC44NTMyMzUsLTAuMDU1OTAzIDEuMTM0NjY1LC0wLjc3MjM2OTQiIHN0eWxlPSJmaWxsOm5vbmU7ZmlsbC1ydWxlOmV2ZW5vZGQ7c3Ryb2tlOiM1MDUwNTA7c3Ryb2tlLXdpZHRoOjAuMTA0NjA5OTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLW9wYWNpdHk6MSIgLz4gPHRleHQgaWQ9InRleHQ0MjQ1IiB5PSIyLjA1MTI3MTQiIHg9IjExLjU1NzI5OSIgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXNpemU6MC4xMjU1MzE4OHB4O2xpbmUtaGVpZ2h0OjAlO2ZvbnQtZmFtaWx5OnNhbnMtc2VyaWY7bGV0dGVyLXNwYWNpbmc6MHB4O3dvcmQtc3BhY2luZzowcHg7ZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDowLjAxMDQ2MDk5cHg7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW9wYWNpdHk6MSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHRzcGFuIHN0eWxlPSJmb250LXNpemU6MC40MTg0Mzk2cHg7bGluZS1oZWlnaHQ6MS4yNTtzdHJva2Utd2lkdGg6MC4wMTA0NjA5OXB4IiB5PSIyLjA1MTI3MTQiIHg9IjExLjU1NzI5OSIgaWQ9InRzcGFuNDI0NyI+wqA8L3RzcGFuPjwvdGV4dD4gPC9nPiA8L3N2Zz4=";
                    console.log("%cMusic Blocks",
                        "font-size: 24px; font-weight: bold; font-family: sans-serif; padding:20px 0 0 110px; background: url(" + imgUrl + ") no-repeat;");
                    console.log("%cMusic Blocks is a collection of tools for exploring fundamental musical concepts in a fun way.",
                        "font-size: 16px; font-family: sans-serif; font-weight: bold;")
                    // playbackOnLoad();
                }, 1000);
            }

            document.removeEventListener('finishedLoading', __afterLoad);
        };

        // After we have finished loading the project, clear all
        // to ensure a clean start.
        if (document.addEventListener) {
            document.addEventListener('finishedLoading', __afterLoad);
        } else {
            document.attachEvent('finishedLoading', __afterLoad);
        }

        if (sessionData) {
            doLoadAnimation();
            try {
                if (sessionData === 'undefined' || sessionData === '[]') {
                    console.debug('empty session found: loading start');
                    justLoadStart();
                } else {
                    window.loadedSession = sessionData;
                    console.debug(`restoring session: (in variable loadedSession) ${sessionData.substring(0,50)}...`);
                    // First, hide the palettes as they will need updating.
                    for (var name in blocks.palettes.dict) {
                        blocks.palettes.dict[name].hideMenu(true);
                    }

                    logo.playbackQueue = {};
                    blocks.loadNewBlocks(JSON.parse(sessionData));
                    setPlaybackStatus();
                }
            } catch (e) {
                console.debug(e);
            }
        } else {
            justLoadStart();
        }

        update = true;
    };

    /*
     * Hides all message containers
     */
    hideMsgs = function () {
        errorMsgText.parent.visible = false;
        hideArrows();

        msgText.parent.visible = false;
        for (var i in errorArtwork) {
            errorArtwork[i].visible = false;
        }

        refreshCanvas();
    };

    hideArrows = function() {
        if (errorMsgArrow != null) {
            errorMsgArrow.removeAllChildren();
            refreshCanvas();
        }
    }


    textMsg = function (msg) {
        if (msgText == null) {
            // The container may not be ready yet, so do nothing.
            return;
        }

        // Show and populate printText div
        var printText = document.getElementById("printText");
        printText.classList.add("show");

        var printTextContent = document.getElementById("printTextContent");
        printTextContent.innerHTML = msg;

    };

    errorMsg = function (msg, blk, text, timeout) {
        /*
        if (logo.optimize) {
            return;
        }
        */
        if (errorMsgTimeoutID != null) {
            clearTimeout(errorMsgTimeoutID);
        }

        // Hide the button, as the program is going to be
        // terminated.
        _hideStopButton();

        if (errorMsgText == null) {
            // The container may not be ready yet, so do nothing.
            return;
        }

        if (blk !== undefined && blk != null && !blocks.blockList[blk].collapsed) {
            var fromX = (canvas.width - 1000) / 2;
            var fromY = 128;
            var toX = blocks.blockList[blk].container.x + blocksContainer.x;
            var toY = blocks.blockList[blk].container.y + blocksContainer.y;

            if (errorMsgArrow == null) {
                errorMsgArrow = new createjs.Container();
                stage.addChild(errorMsgArrow);
            }

            var line = new createjs.Shape();
            errorMsgArrow.addChild(line);
            line.graphics.setStrokeStyle(4).beginStroke('#ff0031').moveTo(fromX, fromY).lineTo(toX, toY);
            stage.setChildIndex(errorMsgArrow, stage.children.length - 1);

            var angle = Math.atan2(toX - fromX, fromY - toY) / Math.PI * 180;
            var head = new createjs.Shape();
            errorMsgArrow.addChild(head);
            head.graphics.setStrokeStyle(4).beginStroke('#ff0031').moveTo(-10, 18).lineTo(0, 0).lineTo(10, 18);
            head.x = toX;
            head.y = toY;
            head.rotation = angle;
        }

        switch (msg) {
            case NOMICERRORMSG:
                errorArtwork['nomicrophone'].visible = true;
                stage.setChildIndex(errorArtwork['nomicrophone'], stage.children.length - 1);
                break;
            case NOSTRINGERRORMSG:
                errorArtwork['notastring'].visible = true;
                stage.setChildIndex(errorArtwork['notastring'], stage.children.length - 1);
                break;
            case EMPTYHEAPERRORMSG:
                errorArtwork['emptyheap'].visible = true;
                stage.setChildIndex(errorArtwork['emptyheap'], stage.children.length - 1);
                break;
            case NOSQRTERRORMSG:
                errorArtwork['negroot'].visible = true;
                stage.setChildIndex(errorArtwork['negroot'], stage.children.length - 1);
                break;
            case NOACTIONERRORMSG:
                if (text == null) {
                    text = 'foo';
                }

                errorArtwork['nostack'].children[1].text = text;
                errorArtwork['nostack'].visible = true;
                errorArtwork['nostack'].updateCache();
                stage.setChildIndex(errorArtwork['nostack'], stage.children.length - 1);
                break;
            case NOBOXERRORMSG:
                if (text == null) {
                    text = 'foo';
                }

                errorArtwork['emptybox'].children[1].text = text;
                errorArtwork['emptybox'].visible = true;
                errorArtwork['emptybox'].updateCache();
                stage.setChildIndex(errorArtwork['emptybox'], stage.children.length - 1);
                break;
            case ZERODIVIDEERRORMSG:
                errorArtwork['zerodivide'].visible = true;
                stage.setChildIndex(errorArtwork['zerodivide'], stage.children.length - 1);
                break;
            case NANERRORMSG:
                errorArtwork['notanumber'].visible = true;
                stage.setChildIndex(errorArtwork['notanumber'], stage.children.length - 1);
                break;
            case NOINPUTERRORMSG:
                errorArtwork['noinput'].visible = true;
                stage.setChildIndex(errorArtwork['noinput'], stage.children.length - 1);
                break;
            default:
                // Show and populate errorText div
                var errorText = document.getElementById("errorText");
                errorText.classList.add("show");
                var errorTextContent = document.getElementById("errorTextContent");
                errorTextContent.innerHTML = msg;
                break;
        }

        if (timeout != undefined) {
            var myTimeout = timeout;
        } else {
            var myTimeout = _ERRORMSGTIMEOUT_;
        }

        if (myTimeout > 0) {
            errorMsgTimeoutID = setTimeout(function () {
                hideMsgs();
            }, myTimeout);
        }

        refreshCanvas();
    };

    /*
     * Hides cartesian grid
     */
    _hideCartesian = function () {
        cartesianBitmap.visible = false;
        cartesianBitmap.updateCache();
        update = true;
    };

    /*
     * Shows cartesian grid
     */
    _showCartesian = function () {
        cartesianBitmap.visible = true;
        cartesianBitmap.updateCache();
        update = true;
    };

    /*
     * Hides polar grid
     */
    _hidePolar = function () {
        polarBitmap.visible = false;
        polarBitmap.updateCache();
        update = true;
    };

    /*
     * Shows polar grid
     */
    _showPolar = function () {
        polarBitmap.visible = true;
        polarBitmap.updateCache();
        update = true;
    };

    // function pasteStack() {
    //     closeSubMenus();
    //     blocks.pasteStack();
    // };

    /*
     * We don't save blocks in the trash, so we need to
     * consolidate the block list and remap the connections.
     *
     * Next, save the playback queue, but don't save the
     * playback queue if we are saving to Lilypond.
     */
    function prepareExport() {

        var blockMap = [];
        var hasMatrixDataBlock = false;
        for (var blk = 0; blk < blocks.blockList.length; blk++) {
            var myBlock = blocks.blockList[blk];
            if (myBlock.trash) {
                // Don't save blocks in the trash.
                continue;
            }

            blockMap.push(blk);
        }

        var data = [];
        for (var blk = 0; blk < blocks.blockList.length; blk++) {
            var myBlock = blocks.blockList[blk];
            if (myBlock.trash) {
                // Don't save blocks in the trash.
                continue;
            }

            if (myBlock.isValueBlock() || myBlock.name === 'loadFile' || myBlock.name === 'boolean') {
                // FIX ME: scale image if it exceeds a maximum size.
                var args = {
                    'value': myBlock.value
                };
            } else {
                switch (myBlock.name) {
                    case 'start':
                    case 'drum':
                        // Find the turtle associated with this block.
                        var turtle = turtles.turtleList[myBlock.value];
                        if (turtle == null) {
                            var args = {
                                'collapsed': false,
                                'xcor': 0,
                                'ycor': 0,
                                'heading': 0,
                                'color': 0,
                                'shade': 50,
                                'pensize': 5,
                                'grey': 100
                            };
                        } else {
                            var args = {
                                'collapsed': myBlock.collapsed,
                                'xcor': turtle.x,
                                'ycor': turtle.y,
                                'heading': turtle.orientation,
                                'color': turtle.color,
                                'shade': turtle.value,
                                'pensize': turtle.stroke,
                                'grey': turtle.chroma,
                                'name': turtle.name
                            };
                        }
                        break;
                    case 'temperament1':
                        if (blocks.customTemperamentDefined) {
                            // If temperament block is present
                            var args = {
                                'customTemperamentNotes': TEMPERAMENT['custom'],
                                'startingPitch': logo.synth.startingPitch,
                                'octaveSpace': OCTAVERATIO
                            };
                        }
                        break;
                    case 'interval':
                    case 'newnote':
                    case 'action':
                    case 'matrix':
                    case 'pitchdrummatrix':
                    case 'rhythmruler':
                    case 'timbre':
                    case 'pitchstaircase':
                    case 'tempo':
                    case 'pitchslider':
                    case 'musickeyboard':
                    case 'modewidget':
                    case 'meterwidget':
                    case 'status':
                        var args = {
                            'collapsed': myBlock.collapsed
                        }
                        break;
                    case 'namedbox':
                    case 'storein2':
                    case 'nameddo':
                    case 'nameddoArg':
                    case 'namedcalc':
                    case 'namedcalcArg':
                    case 'namedarg':
                        var args = {
                            'value': myBlock.privateData
                        }
                        break;
                    case 'nopValueBlock':
                    case 'nopZeroArgBlock':
                    case 'nopOneArgBlock':
                    case 'nopTwoArgBlock':
                    case 'nopThreeArgBlock':
                        // restore original block name
                        myBlock.name = myBlock.privateData;
                        var args = {}
                        break;
                    case 'matrixData':
                        // deprecated
                        var args = {
                            'notes': window.savedMatricesNotes,
                            'count': window.savedMatricesCount
                        }
                        hasMatrixDataBlock = true;
                        break;
                    default:
                        var args = {}
                        break;
                }
            }

            connections = [];
            for (var c = 0; c < myBlock.connections.length; c++) {
                var mapConnection = blockMap.indexOf(myBlock.connections[c]);
                if (myBlock.connections[c] == null || mapConnection === -1) {
                    connections.push(null);
                } else {
                    connections.push(mapConnection);
                }
            }

            data.push([blockMap.indexOf(blk), [myBlock.name, args], myBlock.container.x, myBlock.container.y, connections]);
        }

        // remap block connections

        if (logo.runningLilypond) {
            logo.playbackQueue = {};
        }

        var i = data.length;
        if (i > 0) {
            for (var turtle = 0; turtle < turtles.turtleList.length; turtle++) {
                if (turtle in logo.playbackQueue) {
                    for (var j = 0; j < logo.playbackQueue[turtle].length; j++) {
                        data.push([i, turtle, logo.playbackQueue[turtle][j]]);
                        i += 1;
                    }
                }
            }
        }

        return JSON.stringify(data);
    };

    /*
     * Opens plugin by clicking on the plugin open chooser in the DOM (.json).
     */
    doOpenPlugin = function () {
        toolbar.closeAuxToolbar(_showHideAuxMenu);
        pluginChooser.focus();
        pluginChooser.click();
    };

    _hideStopButton = function () {
        /*
        if (stopTurtleContainer === null) {
            return;
        }

        stopTurtleContainer.visible = false;
        hardStopTurtleContainer.visible = true;
        */
    };

    _showStopButton = function () {
        /*
        if (stopTurtleContainer === null) {
            return;
        }

        stopTurtleContainer.visible = true;
        hardStopTurtleContainer.visible = false;
        */
    };

    // function blinkPasteButton(bitmap) {
    //     function handleComplete() {
    //         createjs.Tween.get(bitmap).to({
    //             alpha: 1,
    //             visible: true
    //         }, 500);
    //     };

    //     createjs.Tween.get(bitmap).to({
    //         alpha: 0,
    //         visible: false
    //     }, 1000).call(
    //         handleComplete);
    // };

    /*
     * Specifies that loading an MB project should merge it
     * within the existing project
     */
    _doMergeLoad = function () {
        doLoad(true);
    };

    /*
     * Sets up palette buttons and functions
     * e.g. Home, Collapse, Expand
     * These menu items are on the canvas, not the toolbar.
     */
    _setupPaletteMenu = function (turtleBlocksScale) {
        // Clean up if we've been here before.
        if (homeButtonContainers.length !== 0) {
            stage.removeChild(homeButtonContainers[0]);
            stage.removeChild(homeButtonContainers[1]);
            stage.removeChild(hideBlocksContainer[0]);
            stage.removeChild(hideBlocksContainer[1]);
            stage.removeChild(collapseBlocksContainer);
            stage.removeChild(smallerContainer);
            stage.removeChild(smallerOffContainer);
            stage.removeChild(largerContainer);
            stage.removeChild(largerOffContainer);
        }

        var btnSize = cellSize;
        // Upper left
        // var x = 27.5 + 6;
        // var y = toolbarHeight + 95.5 + 6;
        // Lower right
        var x = this._innerWidth - 4 * btnSize - 27.5;
        var y = this._innerHeight - 27.5;
        var dx = btnSize;

        homeButtonContainers = [];
        homeButtonContainers.push(_makeButton(GOHOMEBUTTON, _('Home') + ' [' + _('Home').toUpperCase() + ']', x, y, btnSize, 0));
        that._loadButtonDragHandler(homeButtonContainers[0], x, y, _findBlocks, null, null, null, null);

        homeButtonContainers.push(_makeButton(GOHOMEFADEDBUTTON, _('Home') + ' [' + _('Home').toUpperCase() + ']', x, y - btnSize, btnSize, 0));
        that._loadButtonDragHandler(homeButtonContainers[1], x, y, _findBlocks, null, null, null, null);
        homeButtonContainers[1].visible = false;

        homeButtonContainers[0].y = this._innerHeight - 27.5; // toolbarHeight + 95.5 + 6;
        homeButtonContainers[1].y = this._innerHeight - 27.5; // toolbarHeight + 95.5 + 6;
        boundary.hide();

        x += dx;

        hideBlocksContainer = [];
        hideBlocksContainer.push(_makeButton(HIDEBLOCKSBUTTON, _('Show/hide block'), x, y, btnSize, 0));
        that._loadButtonDragHandler(hideBlocksContainer[0], x, y, _changeBlockVisibility, null, null, null, null);

        hideBlocksContainer.push(_makeButton(HIDEBLOCKSFADEDBUTTON, _('Show/hide block'), x, y - btnSize, btnSize, 0));
        that._loadButtonDragHandler(hideBlocksContainer[1], x, y, _changeBlockVisibility, null, null, null, null);
        hideBlocksContainer[1].visible = false;

        hideBlocksContainer[0].y = this._innerHeight - 27.5; // toolbarHeight + 95.5 + 6;
        hideBlocksContainer[1].y = this._innerHeight - 27.5; // toolbarHeight + 95.5 + 6;

        x += dx;

        collapseBlocksContainer = _makeButton(COLLAPSEBLOCKSBUTTON, _('Expand/collapse blocks'), x, y, btnSize, 0);
        that._loadButtonDragHandler(collapseBlocksContainer, x, y, _toggleCollapsibleStacks, null, null, null, null);

        x += dx;

        smallerContainer = _makeButton(SMALLERBUTTON, _('Decrease block size'), x, y, btnSize, 0);
        that._loadButtonDragHandler(smallerContainer, x, y, doSmallerBlocks, null, null, null, null);

        smallerOffContainer = _makeButton(SMALLERDISABLEBUTTON, _('Cannot be further decreased'), x, y, btnSize, 0);
        smallerOffContainer.visible = false;

        x += dx;

        largerContainer = _makeButton(BIGGERBUTTON, _('Increase block size'), x, y, btnSize, 0);
        that._loadButtonDragHandler(largerContainer, x, y, doLargerBlocks, null, null, null, null);

        largerOffContainer = _makeButton(BIGGERDISABLEBUTTON, _('Cannot be further increased'), x, y, btnSize, 0);
        largerOffContainer.visible = false;
    };

    // function doPopdownPalette() {
    //     var p = new PopdownPalette(palettes);
    //     p.popdown();
    // };

    /*
     * Shows help page
     */
    _showHelp = function () {
        var helpWidget = new HelpWidget();
        helpWidget.init(null);
    };

    /*
     * Shows about page
     */
    _showAboutPage = function () {
        var helpWidget = new HelpWidget();
        helpWidget.init(null);
        helpWidget.showPageByName(_('About'));
    };

    /*
     * REDUNDANT
     */
    _doMenuButton = function () {
        _doMenuAnimation(true);
    };

    /*
     * REDUNDANT
     */
    _doMenuAnimation = function (arg) {
        if (arg === undefined) {
            var animate = true;
        } else {
            var animate = arg;
        }

        if (animate) {
            var timeout = 500;
        } else {
            var timeout = 50;
        }

        var bitmap = last(menuContainer.children);
        if (bitmap != null) {
            if (animate) {
                var r = bitmap.rotation;
                if (r % 95.5 !== 0) {
                    return;
                }

                createjs.Tween.get(bitmap)
                    .to({
                        rotation: r
                    })
                    .to({
                        rotation: r + 95.5
                    }, 500);
            } else {
                bitmap.rotation += 95.5;
            }
        } else {
            // Race conditions during load
            setTimeout(_doMenuAnimation, 50);
        }

        setTimeout(function () {
            if (menuButtonsVisible) {
                menuButtonsVisible = false;
            } else {
                menuButtonsVisible = true;
                if (_THIS_IS_MUSIC_BLOCKS_) {
                    if (beginnerMode) {
                        advancedModeContainer.visible = false;
                    } else {
                        beginnerModeContainer.visible = true;
                        that.setScrollerButton()
                    }
                } else {
                    that.setScrollerButton()
                }
            }
            update = true;
        }, timeout);
    };

    /*
     * REDUNDANT
     */
    _toggleToolbar = function () {
        buttonsVisible = !buttonsVisible;
        menuContainer.visible = buttonsVisible;
        headerContainer.visible = buttonsVisible;
        for (var button in onscreenButtons) {
            onscreenButtons[button].visible = buttonsVisible;
        }

        for (var button in onscreenMenu) {
            onscreenMenu[button].visible = buttonsVisible;
        }

        if (buttonsVisible) {
            if (_THIS_IS_MUSIC_BLOCKS_) {
                if (beginnerMode) {
                    advancedModeContainer.visible = false;
                } else {
                    beginnerModeContainer.visible = true;
                    that.setScrollerButton()
                }
            } else {
                that.setScrollerButton()
            }
        }

        update = true;
    };

    /*
     * Makes non-toolbar buttons, e.g., the palette menu buttons
     */
    _makeButton = function (name, label, x, y, size, rotation, parent) {
        var container = new createjs.Container();

        if (parent == undefined) {
            stage.addChild(container);
        } else {
            parent.addChild(container);
        }

        container.x = x;
        container.y = y;

        var text = new createjs.Text(label, '14px Sans', '#282828');
        if (container.x < 55) {
            text.textAlign = 'left';
            text.x = -14;
        } else if (container.x > 255) {
            text.textAlign = 'right';
            text.x = 14;
        } else {
            text.textAlign = 'center';
            text.x = 0;
        }

        if (y > 255) {
            text.y = -60;
        } else {
            text.y = 30;
        }

        text.visible = false;

        var circles;
        container.on('mouseover', function (event) {
            for (var c = 0; c < container.children.length; c++) {
                if (container.children[c].text != undefined) {
                    container.children[c].visible = true;
                    // Do we need to add a background?
                    // Should be image and text, hence === 2
                    if ([2, 5, 8].indexOf(container.children.length) !== -1) {
                        var b = container.children[c].getBounds();
                        var bg = new createjs.Shape();
                        if (container.children[c].textAlign === 'center') {
                            bg.graphics.beginFill('#FFF').drawRoundRect(b.x - 8, container.children[c].y - 2, b.width + 16, b.height + 8, 10, 10, 10, 10);
                        } else if (container.children[c].textAlign === 'left') {
                            bg.graphics.beginFill('#FFF').drawRoundRect(b.x - 22, container.children[c].y - 2, b.width + 16, b.height + 8, 10, 10, 10, 10);
                        } else {
                            bg.graphics.beginFill('#FFF').drawRoundRect(b.x + 8, container.children[c].y - 2, b.width + 16, b.height + 8, 10, 10, 10, 10);
                        }
                        container.addChildAt(bg, 0);
                    }

                    container.children[0].visible = true;
                    stage.update();
                    break;
                }
            }

            var r = size / 2;
            circles = showButtonHighlight(container.x, container.y, r, event, palettes.scale, stage);
        });

        container.on('mouseout', function (event) {
            hideButtonHighlight(circles, stage);
            for (var c = 0; c < container.children.length; c++) {
                if (container.children[c].text != undefined) {
                    container.children[c].visible = false;
                    container.children[0].visible = false;
                    stage.update();
                    break;
                }
            }
        });

        var img = new Image();

        img.onload = function () {
            var originalSize = 55; // this is the original svg size
            var halfSize = Math.floor(size / 2);

            var bitmap = new createjs.Bitmap(img);
            if (size !== originalSize) {
                bitmap.scaleX = size / originalSize;
                bitmap.scaleY = size / originalSize;
            }

            bitmap.regX = halfSize / bitmap.scaleX;
            bitmap.regY = halfSize / bitmap.scaleY;
            if (rotation !== undefined) {
                bitmap.rotation = rotation;
            }

            container.addChild(bitmap);
            var hitArea = new createjs.Shape();
            hitArea.graphics.beginFill('#FFF').drawEllipse(-halfSize, -halfSize, size, size);
            hitArea.x = 0;
            hitArea.y = 0;
            container.hitArea = hitArea;
            bitmap.cache(0, 0, size, size);
            bitmap.updateCache();
            update = true;
        };

        img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(name)));
        container.addChild(text);
        return container;
    };

    /*
     * @param container longAction
     * @param ox extraLongAction,
     * @param oy longImg,
     * @param hoverAction extraLongImg
     *
     * Handles button dragging, long hovering and prevents multiple button presses
     */
    this._loadButtonDragHandler = function (container, ox, oy, action, hoverAction) {
        // Prevent multiple button presses (i.e., debounce).
        var lockTimer = null;
        var locked = false;

        /*
        if (longAction === null) {
            longAction = action;
        }

        if (extraLongAction === null) {
            extraLongAction = longAction;
        }

        // Long and extra-long press variables declaration
        var pressTimer = null;
        var isLong = false;
        var pressTimerExtra = null;
        var isExtraLong = false;

        var formerContainer = container;
        */

        // Long hover variables
        var hoverTimer = null;
        var isLongHover = false;

        container.on('mouseover', function (event) {
            if (!loading) {
                document.body.style.cursor = 'pointer';
            }

            if (hoverAction === null) {
                return;
            }

            if (locked) {
                return;
            } else {
                locked = true;
                lockTimer = setTimeout(function () {
                    locked = false;

                    clearTimeout(hoverTimer);
                }, 2000);
            }

            hoverTimer = setTimeout(function () {
                isLongHover = true;
                console.debug('HOVER ACTION');
                hoverAction(false);
            }, 1500);
        });

        container.on('mouseout', function (event) {
            if (!loading) {
                document.body.style.cursor = 'default';
            }

            if (hoverTimer !== null) {
                clearTimeout(hoverTimer);
            }
        });

        container.removeAllEventListeners('mousedown');
        container.on('mousedown', function (event) {
            /*
            if (locked) {
                return;
            } else {
                locked = true;

                lockTimer = setTimeout(function () {
                    locked = false;

                    clearTimeout(pressTimer);
                    clearTimeout(pressTimerExtra);
                    if (longImg !== null || extraLongImg !== null) {
                        container.visible = false;
                        container = formerContainer;
                        container.visible = true;
                    }
                }, 1500);
            }

            var mousedown = true;

            pressTimer = setTimeout(function () {
                isLong = true;
                if (longImg !== null) {
                    container.visible = false;
                    container = _makeButton(longImg, '', ox, oy, cellSize, 0);
                }
            }, 500);

            pressTimerExtra = setTimeout(function () {
                isExtraLong = true;
                if (extraLongImg !== null) {
                    container.visible = false;
                    container = _makeButton(extraLongImg, '', ox, oy, cellSize, 0);
                }
            }, 1000);
            */
            var circles = showButtonHighlight(ox, oy, cellSize / 2, event, turtleBlocksScale, stage);

            function __pressupFunction(event) {
                hideButtonHighlight(circles, stage);

                /*
                clearTimeout(lockTimer);

                if (longImg !== null || extraLongImg !== null) {
                    container.visible = false;
                    container = formerContainer;
                    container.visible = true;
                }

                locked = false;

                if (action != null && mousedown && !locked) {
                    clearTimeout(pressTimer);
                    clearTimeout(pressTimerExtra);

                    if (!isLong) {
                        action();
                    } else if (!isExtraLong) {
                        longAction();
                    } else {
                        extraLongAction();
                    }
                }
                */

                action();
                mousedown = false;
            };

            container.removeAllEventListeners('pressup');
            var closure = container.on('pressup', __pressupFunction);

            isLongHover = false;
            // isLong = false;
            // isExtraLong = false;
        });
    };

    /*
     * Handles pasted strings into input fields
     */
    pasted = function () {
        var pasteinput = docById('paste').value;
        var rawData = pasteinput;
        if (rawData == null || rawData == '') {
            return;
        }

        var cleanData = rawData.replace('\n', ' ');
        try {
            var obj = JSON.parse(cleanData);
        } catch (e) {
            errorMsg(_('Could not parse JSON input.'));
            return;
        }

        for (var name in blocks.palettes.dict) {
            blocks.palettes.dict[name].hideMenu(true);
        }

        refreshCanvas();

        blocks.loadNewBlocks(obj);
        pasteBox.hide();
    };

    /*
     *
     * @param dy how much of a change in y
     *
     * Handles changes in y coordinates of elements when
     * aux toolbar is opened.
     * Repositions elements on screen by a certain amount (dy)
     */
    deltaY = function (dy) {
        toolbarHeight += dy;
        for (var i = 0; i < onscreenButtons.length; i++) {
            onscreenButtons[i].y += dy;
        }

        // logoContainer.y += dy;
        homeButtonContainers[0].y = this._innerHeight - 27.5; // toolbarHeight + 95.5 + 6;
        homeButtonContainers[1].y = homeButtonContainers[0].y;
        hideBlocksContainer.y = homeButtonContainers[0].y;
        collapseBlocksContainer.y = homeButtonContainers[0].y;
        smallerContainer.y = homeButtonContainers[0].y;
        largerContainer.y = homeButtonContainers[0].y;

        for (var i = 0; i < onscreenMenu.length; i++) {
            onscreenMenu[i].y += dy;
        }

        palettes.deltaY(dy);
        turtles.deltaY(dy);

        // menuContainer.y += dy;
        blocksContainer.y += dy;
        /*
        var language = localStorage.languagePreference;
        if (!beginnerMode || language !== 'ja') {
            slowContainer.y += dy;
            stepContainer.y += dy;
        }
        */
        refreshCanvas();
    };

    /*
     * Open aux menu
     */
    _openAuxMenu = function () {
        if (!turtles.running() && toolbarHeight === 0) {
            _showHideAuxMenu(false);
        }
    };

    /*
     * Toggles Aux menu visibility and positioning
     */
    _showHideAuxMenu = function (resize) {
        var cellsize = 55;
        if (!resize && toolbarHeight === 0) {
            dy = cellsize + LEADING + 5;
            toolbarHeight = dy;

            // These buttons are smaller, hence + 6
            homeButtonContainers[0].y = this._innerHeight - 27.5; // toolbarHeight + 95.5 + 6;
            homeButtonContainers[1].y = homeButtonContainers[0].y;
            hideBlocksContainer.y = homeButtonContainers[0].y;
            collapseBlocksContainer.y = homeButtonContainers[0].y;
            smallerContainer.y = homeButtonContainers[0].y;
            largerContainer.y = homeButtonContainers[0].y;

            palettes.deltaY(dy);
            turtles.deltaY(dy);

            blocksContainer.y += dy;
            blocks.checkBounds();
        } else {
            var dy = toolbarHeight;
            toolbarHeight = 0;

            homeButtonContainers[0].y = this._innerHeight - 27.5; // toolbarHeight + 95.5 + 6;
            homeButtonContainers[1].y = homeButtonContainers[0].y;
            hideBlocksContainer.y = homeButtonContainers[0].y;
            collapseBlocksContainer.y = homeButtonContainers[0].y;
            smallerContainer.y = homeButtonContainers[0].y;
            largerContainer.y = homeButtonContainers[0].y;

            palettes.deltaY(-dy);
            turtles.deltaY(-dy);

            blocksContainer.y -= dy;
        }

        refreshCanvas();
    };

    /*
     * Ran once dom is ready and editable
     * Sets up dependencies and vars
     */
    this.domReady = async function (doc) {
        // _onResize = _onResize;
        // var that = this;
        // window.onblur = functionf () {
        //     this.that.doHardStopButton(true);
        // };
        saveLocally = undefined;

        // Do we need to update the stage?
        update = true;

        // Coordinate grid
        cartesianBitmap = null;

        // Polar grid
        polarBitmap = null;

        // Msg block
        msgText = null;

        // ErrorMsg block
        errorMsgText = null;
        errorMsgArrow = null;
        errorMsgTimeoutID = null;
        errorArtwork = {};
        ERRORARTWORK = ['emptybox', 'emptyheap', 'negroot', 'noinput', 'zerodivide', 'notanumber', 'nostack', 'notastring', 'nomicrophone'];

        // Get things started
        await this.init();
    };

    /*
     * Inits everything. The main function.
     */
    this.init = async function () {
        console.debug('document.body.clientWidth and clientHeight: ' + document.body.clientWidth + ' ' + document.body.clientHeight);
        this._clientWidth = document.body.clientWidth;
        this._clientHeight = document.body.clientHeight;

        this._innerWidth = window.innerWidth;
        this._innerHeight = window.innerHeight;
        this._outerWidth = window.outerWidth;
        this._outerHeight = window.outerHeight;

        console.debug('window inner/outer width/height: ' + this._innerWidth + ', ' + this._innerHeight + ' ' + this._outerWidth + ', ' + this._outerHeight);

        if (sugarizerCompatibility.isInsideSugarizer()) {
            //sugarizerCompatibility.data.blocks = prepareExport();
            storage = sugarizerCompatibility.data;
        } else {
            storage = localStorage;
        }

        docById('loader').className = 'loader';

        stage = new createjs.Stage(canvas);
        createjs.Touch.enable(stage);

        createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.framerate = 15;
        // createjs.Ticker.addEventListener('tick', stage);
        createjs.Ticker.addEventListener('tick', that.__tick);

        _createMsgContainer('#ffffff', '#7a7a7a', function (text) {
            msgText = text;
        }, 130);

        _createMsgContainer('#ffcbc4', '#ff0031', function (text) {
            errorMsgText = text;
        }, 130);

        _createErrorContainers();

        /* Z-Order (top to bottom):
         *   menus
         *   palettes
         *   blocks
         *   trash
         *   turtles
         *   logo (drawing)
         */
        palettesContainer = new createjs.Container();
        blocksContainer = new createjs.Container();
        trashContainer = new createjs.Container();
        turtleContainer = new createjs.Container();
        /*
        console.debug(turtleContainer);
        turtleContainer.scaleX = 0.5;
        turtleContainer.scaleY = 0.5;
        turtleContainer.x = 100;
        turtleContainer.y = 100;
        */
        stage.addChild(turtleContainer);
        stage.addChild(trashContainer, blocksContainer, palettesContainer);
        that._setupBlocksContainerEvents();

        trashcan = new Trashcan();
        trashcan
            .setCanvas(canvas)
            .setStage(trashContainer)
            .setSize(cellSize)
            .setRefreshCanvas(refreshCanvas)
            .init();

        // Put the boundary in the turtles container so it scrolls
        // with the blocks.
        turtles = new Turtles();
        turtles
            .setCanvas(canvas)
            .setClear(_allClear)
            .setHideMenu(hideAuxMenu)
            .setMasterStage(stage)
            .setStage(turtleContainer)
            .setHideGrids(hideGrids)
            .setDoGrid(_doCartesianPolar)
            .setRefreshCanvas(refreshCanvas);

        // Put the boundary in the blocks container so it scrolls
        // with the blocks.

        boundary = new Boundary();
        boundary
            .setStage(blocksContainer)
            .init();

        blocks = new Blocks();
        blocks
            .setCanvas(canvas)
            .setStage(blocksContainer)
            .setRefreshCanvas(refreshCanvas)
            .setTrashcan(trashcan)
            .setUpdateStage(stage.update)
            .setGetStageScale(getStageScale)
            .setTurtles(turtles)
            .setSetPlaybackStatus(setPlaybackStatus)
            .setErrorMsg(errorMsg)
            .setHomeContainers(setHomeContainers, boundary);

        turtles.setBlocks(blocks);

        palettes = new Palettes();
        palettes
            .setCanvas(canvas)
            .setStage(palettesContainer)
            .setRefreshCanvas(refreshCanvas)
            .setSize(cellSize)
            .setTrashcan(trashcan)
            .setSearch(showSearchWidget, hideSearchWidget)
            .setBlocks(blocks)
            .init();

        // initPalettes(palettes);

        logo = new Logo();
        logo
            .setCanvas(canvas)
            .setBlocks(blocks)
            .setTurtles(turtles)
            .setStage(turtleContainer)
            .setRefreshCanvas(refreshCanvas)
            .setTextMsg(textMsg)
            .setErrorMsg(errorMsg)
            .setHideMsgs(hideMsgs)
            .setOnStopTurtle(that.onStopTurtle)
            .setOnRunTurtle(that.onRunTurtle)
            .setGetStageX(getStageX)
            .setGetStageY(getStageY)
            .setGetStageMouseDown(getStageMouseDown)
            .setGetCurrentKeyCode(that.getCurrentKeyCode)
            .setClearCurrentKeyCode(that.clearCurrentKeyCode)
            // .setMeSpeak(meSpeak)
            .setSetPlaybackStatus(setPlaybackStatus);

        blocks.setLogo(logo);

        pasteBox = new PasteBox();
        pasteBox
            .setCanvas(canvas)
            .setStage(stage)
            .setRefreshCanvas(refreshCanvas)
            .setPaste(paste);

        languageBox = new LanguageBox();
        languageBox.setMessage(textMsg);

        // show help on startup if first time uer
        if (firstTimeUser) {
            _showHelp();
        }

        playbackOnLoad = function () {
            /*
            if (_THIS_IS_TURTLE_BLOCKS_) {
                // Play playback queue if there is one.
                for (turtle in logo.playbackQueue) {
                    if (logo.playbackQueue[turtle].length > 0) {
                        setTimeout(function () {
                            logo.playback(-1);
                        }, 3000);
                        break;
                    }
                }
            }
            */
        };

        function PlanetInterface(storage) {
            this.planet = null;
            this.iframe = null;
            this.mainCanvas = null;

            this.hideMusicBlocks = function () {
                hideSearchWidget();
                if (_THIS_IS_MUSIC_BLOCKS_) {
                    storage.setItem('isTimbreHidden', docById('timbreDiv').style.visibility);
                    storage.setItem('isMusicKeyboardHidden', docById('mkbDiv').style.visibility);
                    storage.setItem('isModeWidgetHidden', docById('modeDiv').style.visibility);
                    storage.setItem('isMeterWidgetHidden', docById('meterDiv').style.visibility);
                    storage.setItem('isTemperamentHidden', docById('temperamentDiv').style.visibility);

                    if (docById('mkbDiv').style.visibility !== 'hidden') {
                        docById('mkbDiv').style.visibility = 'hidden';
                        docById('mkbButtonsDiv').style.visibility = 'hidden';
                        docById('mkbTableDiv').style.visibility = 'hidden';
                    }

                    if (docById('pscDiv').style.visibility !== 'hidden') {
                        docById('pscDiv').style.visibility = 'hidden';
                        docById('pscTableDiv').style.visibility = 'hidden';
                        docById('pscButtonsDiv').style.visibility = 'hidden';
                    }

                    if (docById('timbreDiv').style.visibility !== 'hidden') {
                        docById('timbreDiv').style.visibility = 'hidden';
                        docById('timbreTableDiv').style.visibility = 'hidden';
                        docById('timbreButtonsDiv').style.visibility = 'hidden';
                    }

                    if (docById('temperamentDiv').style.visibility !== 'hidden') {
                        docById('temperamentDiv').style.visibility = 'hidden';
                        docById('temperamentTableDiv').style.visibility = 'hidden';
                        docById('temperamentButtonsDiv').style.visibility = 'hidden';
                    }

                    if (docById('modeDiv').style.visibility !== 'hidden') {
                        docById('modeDiv').style.visibility = 'hidden';
                        docById('modeButtonsDiv').style.visibility = 'hidden';
                        docById('modeTableDiv').style.visibility = 'hidden';
                    }

                    if (docById('tempoDiv').style.visibility !== 'hidden') {
                        if (logo.tempo != null) {
                            logo.tempo.hide();
                        }
                    }
                }

                widgetWindows.hideWindows();

                logo.doStopTurtle();
                docById('helpElem').style.visibility = 'hidden';
                document.querySelector('.canvasHolder').classList.add('hide');
                document.querySelector('#canvas').style.display = 'none';
                document.querySelector('#theme-color').content = '#8bc34a';
                setTimeout(function () {
                    // Time to release the mouse
                    stage.enableDOMEvents(false);
                }, 250);
                window.scroll(0, 0);
            }

            this.showMusicBlocks = function () {
                document.getElementById('toolbars').style.display = "block";

                widgetWindows.showWindows();

                if (_THIS_IS_MUSIC_BLOCKS_) {
                    docById('timbreDiv').style.visibility = storage.getItem('isTimbreHidden');
                    docById('timbreButtonsDiv').style.visibility = storage.getItem('isTimbreHidden');
                    docById('timbreTableDiv').style.visibility = storage.getItem('isTimbreHidden');
                    docById('temperamentDiv').style.visibility = storage.getItem('isTemperamentHidden');
                    docById('temperamentButtonsDiv').style.visibility = storage.getItem('isTemperamentHidden');
                    docById('temperamentTableDiv').style.visibility = storage.getItem('isTemperamentHidden');
                    docById('mkbDiv').style.visibility = storage.getItem('isMusicKeyboardHidden');
                    docById('mkbButtonsDiv').style.visibility = storage.getItem('isMusicKeyboardHidden');
                    docById('mkbTableDiv').style.visibility = storage.getItem('isMusicKeyboardHidden');
                    docById('modeDiv').style.visibility = storage.getItem('isModeWidgetHidden');
                    docById('modeButtonsDiv').style.visibility = storage.getItem('isModeWidgetHidden');
                    docById('modeTableDiv').style.visibility = storage.getItem('isModeWidgetHidden');
                    docById('meterDiv').style.visibility = storage.getItem('isMeterWidgetHidden');
                    docById('meterButtonsDiv').style.visibility = storage.getItem('isMeterWidgetHidden');
                    docById('meterTableDiv').style.visibility = storage.getItem('isMeterWidgetHidden');
                }
                document.querySelector('.canvasHolder').classList.remove('hide');
                document.querySelector('#canvas').style.display = '';
                document.querySelector('#theme-color').content = platformColor.header;
                stage.enableDOMEvents(true);
                window.scroll(0, 0);
            };

            this.showPlanet = function () {
                this.planet.open(this.mainCanvas.toDataURL('image/png'));
                this.iframe.style.display = 'block';
                try {
                    this.iframe.contentWindow.document.getElementById('local-tab').click();
                } catch (e) {
                    console.debug(e);
                }
            };

            this.hidePlanet = function () {
                this.iframe.style.display = 'none';
            };

            this.openPlanet = function () {
                console.debug('SAVE LOCALLY');
                this.saveLocally();
                this.hideMusicBlocks();
                this.showPlanet();
            };

            this.closePlanet = function () {
                this.hidePlanet();
                this.showMusicBlocks();
            };

            this.loadProjectFromData = function (data, merge) {
                console.debug('LOAD PROJECT FROM DATA');
                if (merge === undefined) {
                    merge = false;
                }

                this.closePlanet();
                if (!merge) {
                    sendAllToTrash(false, true);
                }

                if (data == undefined) {
                    console.debug('loadRawProject: data is undefined... punting');
                    errorMsg(_('project undefined'));
                    return;
                }

                console.debug('loadRawProject ' + data);
                loading = true;
                document.body.style.cursor = 'wait';
                doLoadAnimation();
                _allClear(false);

                // First, hide the palettes as they will need updating.
                for (var name in blocks.palettes.dict) {
                    blocks.palettes.dict[name].hideMenu(true);
                }

                var __afterLoad = function () {
                    // playbackOnLoad();
                    document.removeEventListener('finishedLoading', __afterLoad);
                };

                if (document.addEventListener) {
                    document.addEventListener('finishedLoading', __afterLoad);
                } else {
                    document.attachEvent('finishedLoading', __afterLoad);
                }

                try {
                    var obj = JSON.parse(data);
                    logo.playbackQueue = {};
                    blocks.loadNewBlocks(obj);
                    setPlaybackStatus();


                } catch (e) {
                    console.debug('loadRawProject: could not parse project data');
                    errorMsg(e);
                }

                loading = false;
                document.body.style.cursor = 'default';
            };

            this.loadProjectFromFile = function () {
                document.querySelector('#myOpenFile').focus();
                document.querySelector('#myOpenFile').click();
                window.scroll(0, 0);
            };

            this.newProject = function () {
                console.debug('NEW');
                this.closePlanet();
                this.initialiseNewProject();
                that._loadStart();
                this.saveLocally();
            };

            this.initialiseNewProject = function (name) {
                this.planet.ProjectStorage.initialiseNewProject(name);
                sendAllToTrash();
                refreshCanvas();
                blocks.trashStacks = [];
            };

            this.saveLocally = function () {
                console.debug('overwriting session data');
                var data = prepareExport();
                var svgData = doSVG(canvas, logo, turtles, 320, 240, 320 / canvas.width);
                try {

                    if (svgData === null || svgData === '') {
                        this.planet.ProjectStorage.saveLocally(data, null);
                    } else {
                        var img = new Image();
                        var t = this;
                        img.onload = function () {
                            var bitmap = new createjs.Bitmap(img);
                            var bounds = bitmap.getBounds();
                            bitmap.cache(bounds.x, bounds.y, bounds.width, bounds.height);
                                t.planet.ProjectStorage.saveLocally(data, bitmap.bitmapCache.getCacheDataURL());
                        };
                        img.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(svgData)));
                    }
                } catch (e) {
                    console.debug(e);
                    if (e.code === DOMException.QUOTA_EXCEEDED_ERR || e.message === "Not enough space to save locally")
                        textMsg(_("Error: Unable to save because you ran out of local storage. Try deleting some saved projects."));
                    else throw e;
                }
                //if (sugarizerCompatibility.isInsideSugarizer()) {
                //    sugarizerCompatibility.saveLocally();
                //}
            };

            this.openCurrentProject = async function () {
                return await this.planet.ProjectStorage.getCurrentProjectData();
            };

            this.openProjectFromPlanet = function (id, error) {
                this.planet.openProjectFromPlanet(id, error);
            };

            this.onConverterLoad = function () {
                window.Converter = this.planet.Converter;
            };

            this.getCurrentProjectName = function () {
                return this.planet.ProjectStorage.getCurrentProjectName();
            };

            this.getCurrentProjectDescription = function () {
                return this.planet.ProjectStorage.getCurrentProjectDescription();
            };

            this.getCurrentProjectImage = function () {
                return this.planet.ProjectStorage.getCurrentProjectImage();
            };

            this.getTimeLastSaved = function () {
                return this.planet.ProjectStorage.TimeLastSaved;
            };

            this.init = async function () {
                this.iframe = document.getElementById('planet-iframe');
                try {
                    await this.iframe.contentWindow.makePlanet(_THIS_IS_MUSIC_BLOCKS_, storage, window._);
                    this.planet = this.iframe.contentWindow.p;
                    this.planet.setLoadProjectFromData(this.loadProjectFromData.bind(this));
                    this.planet.setPlanetClose(this.closePlanet.bind(this));
                    this.planet.setLoadNewProject(this.newProject.bind(this));
                    this.planet.setLoadProjectFromFile(this.loadProjectFromFile.bind(this));
                    this.planet.setOnConverterLoad(this.onConverterLoad.bind(this));
                } catch (e) {
                    console.debug(e);
                    console.debug('Planet not available');
                    this.planet = null;
                }

                window.Converter = this.planet.Converter;
                this.mainCanvas = canvas;
            };
        };

        try {
            console.debug('TRYING TO OPEN PLANET');
            planet = new PlanetInterface(storage);
            await planet.init();
        } catch (e) {
            planet = undefined;
        }

        save = new SaveInterface(planet);
        save.setVariables([
            ['logo', logo],
            ['turtles', turtles],
            ['storage', storage],
            ['printBlockSVG', _printBlockSVG],
            ['planet', planet]
        ]);
        save.init();

        toolbar = new Toolbar();
        toolbar.init(beginnerMode);

        toolbar.renderLogoIcon(_showAboutPage);
        toolbar.renderPlayIcon(that._doFastButton);
        toolbar.renderStopIcon(that.doHardStopButton);
        toolbar.renderNewProjectIcon(_afterDelete);
        toolbar.renderLoadIcon(doLoad);
        toolbar.renderSaveIcons(save.saveHTML.bind(save),  doSVG, save.saveSVG.bind(save), save.savePNG.bind(save), save.saveWAV.bind(save), save.saveLilypond.bind(save), save.saveAbc.bind(save), save.saveMxml.bind(save), save.saveBlockArtwork.bind(save));
        toolbar.renderPlanetIcon(planet, _doOpenSamples);
        toolbar.renderMenuIcon(_showHideAuxMenu);
        toolbar.renderHelpIcon(_showHelp);
        toolbar.renderModeSelectIcon(doSwitchMode);
        toolbar.renderRunSlowlyIcon(that._doSlowButton);
        toolbar.renderRunStepIcon(_doStepButton);
        toolbar.renderAdvancedIcons(doAnalytics, doOpenPlugin, deletePlugin, setScroller, that._setupBlocksContainerEvents);
        toolbar.renderMergeIcon(_doMergeLoad);
        toolbar.renderRestoreIcon(_restoreTrash);
        toolbar.renderLanguageSelectIcon(languageBox);

        if (planet != undefined) {
            saveLocally = planet.saveLocally.bind(planet);
        } else {

            __saveLocally = function () {
                console.debug('overwriting session data (local)');
                var data = prepareExport();
                var svgData = doSVG(canvas, logo, turtles, 320, 240, 320 / canvas.width);

                if (sugarizerCompatibility.isInsideSugarizer()) {
                    //sugarizerCompatibility.data.blocks = prepareExport();
                    storage = sugarizerCompatibility.data;
                } else {
                    storage = localStorage;
                }

                if (storage.currentProject === undefined) {
                    try {
                        storage.currentProject = 'My Project';
                        storage.allProjects = JSON.stringify(['My Project'])
                    } catch (e) {
                        // Edge case, eg. Firefox localSorage DB corrupted
                        console.debug(e);
                    }
                }

                try {
                    var p = storage.currentProject;
                    storage['SESSION' + p] = prepareExport();
                } catch (e) {
                    console.debug(e);
                }

                var img = new Image();
                var svgData = doSVG(canvas, logo, turtles, 320, 240, 320 / canvas.width);

                img.onload = function () {
                    var bitmap = new createjs.Bitmap(img);
                    var bounds = bitmap.getBounds();
                    bitmap.cache(bounds.x, bounds.y, bounds.width, bounds.height);
                    try {
                        storage['SESSIONIMAGE' + p] = bitmap.bitmapCache.getCacheDataURL();
                    } catch (e) {
                        console.debug(e);
                    }
                };

                img.src = 'data:image/svg+xml;base64,' +
                    window.btoa(unescape(encodeURIComponent(svgData)));
                if (sugarizerCompatibility.isInsideSugarizer()) {
                    sugarizerCompatibility.saveLocally();
                }
            }

            saveLocally = __saveLocally;
        }

        window.saveLocally = saveLocally;
        logo.setSaveLocally(saveLocally);

        initPalettes(palettes);

        var __clearFunction = function () {
            sendAllToTrash(true, false);
            if (planet !== undefined) {
                planet.initialiseNewProject.bind(planet);
            }
        };

        // FIXME: Third arg indicates beginner mode
        if (_THIS_IS_MUSIC_BLOCKS_) {
            initBasicProtoBlocks(palettes, blocks, beginnerMode);
        } else {
            initBasicProtoBlocks(palettes, blocks);
        }

        // Load any macros saved in local storage.
        macroData = storage.macros;
        if (macroData != null) {
            processMacroData(macroData, palettes, blocks, macroDict);
        }

        // Blocks and palettes need access to the macros dictionary.
        blocks.setMacroDictionary(macroDict);
        palettes.setMacroDictionary(macroDict);

        // Load any plugins saved in local storage.
        pluginData = storage.plugins;
        if (pluginData != null) {
            var obj = processPluginData(pluginData, palettes, blocks, logo.evalFlowDict, logo.evalArgDict, logo.evalParameterDict, logo.evalSetterDict, logo.evalOnStartList, logo.evalOnStopList, palettes.pluginMacros);
            updatePluginObj(obj);
        }

        // Load custom mode saved in local storage.
        var custommodeData = storage.custommode;
        if (custommodeData != undefined) {
            customMode = JSON.parse(custommodeData);
            console.debug('restoring custom mode: ' + customMode);
        }

        fileChooser.addEventListener('click', function (event) {
            this.value = null;
        });

        fileChooser.addEventListener('change', function (event) {
            // Read file here.
            var reader = new FileReader();

            reader.onload = (function (theFile) {
                loading = true;
                document.body.style.cursor = 'wait';
                doLoadAnimation();

                setTimeout(function () {
                    var rawData = reader.result;
                    if (rawData == null || rawData === '') {
                        console.debug('rawData is ' + rawData);
                        errorMsg(_('Cannot load project from the file. Please check the file type.'));
                    } else {
                        var cleanData = rawData.replace('\n', ' ');

                        try {
                            if (cleanData.includes('html')) {
                                var obj = JSON.parse(cleanData.match('<div class="code">(.+?)<\/div>')[1]);
                            } else {
                                var obj = JSON.parse(cleanData);
                            }
                            // First, hide the palettes as they will need updating.
                            for (var name in blocks.palettes.dict) {
                                blocks.palettes.dict[name].hideMenu(true);
                            }

                            stage.removeAllEventListeners('trashsignal');

                            if (!merging) {
                                // Wait for the old blocks to be removed.
                                var __listener = function (event) {
                                    logo.playbackQueue = {};
                                    blocks.loadNewBlocks(obj);
                                    setPlaybackStatus();
                                    stage.removeAllEventListeners('trashsignal');
                                };

                                stage.addEventListener('trashsignal', __listener, false);
                                sendAllToTrash(false, false);
                                console.debug('clearing on load...');
                                _allClear(false);
                                if (planet) {
                                    planet.initialiseNewProject(fileChooser.files[0].name.substr(0, fileChooser.files[0].name.lastIndexOf('.')));
                                }
                            } else {
                                merging = false;
                                logo.playbackQueue = {};
                                blocks.loadNewBlocks(obj);
                                setPlaybackStatus();
                            }

                            loading = false;
                            refreshCanvas();
                        } catch (e) {
                            errorMsg(_('Cannot load project from the file. Please check the file type.'));
                            console.debug(e);
                            document.body.style.cursor = 'default';
                            loading = false;
                        }
                    }
                }, 200);
            });

            reader.readAsText(fileChooser.files[0]);
        }, false);

        var __handleFileSelect = function (event) {
            event.stopPropagation();
            event.preventDefault();

            var files = event.dataTransfer.files;
            var reader = new FileReader();

            reader.onload = (function (theFile) {
                loading = true;
                document.body.style.cursor = 'wait';
                doLoadAnimation();

                setTimeout(function () {
                    var rawData = reader.result;
                    if (rawData == null || rawData === '') {
                        errorMsg(_('Cannot load project from the file. Please check the file type.'));
                    } else {
                        var cleanData = rawData.replace('\n', ' ');

                        try {
                            if (cleanData.includes('html')) {
                                dat = cleanData.match('<div class="code">(.+?)<\/div>');
                                var obj = JSON.parse(dat[1]);
                            } else {
                                var obj = JSON.parse(cleanData);
                            }
                            for (var name in blocks.palettes.dict) {
                                blocks.palettes.dict[name].hideMenu(true);
                            }

                            stage.removeAllEventListeners('trashsignal');

                            var __afterLoad = function () {
                                // playbackOnLoad();
                                document.removeEventListener('finishedLoading', __afterLoad);
                            };

                            // Wait for the old blocks to be removed.
                            var __listener = function (event) {
                                logo.playbackQueue = {};
                                blocks.loadNewBlocks(obj);
                                setPlaybackStatus();
                                stage.removeAllEventListeners('trashsignal');

                                if (document.addEventListener) {
                                    document.addEventListener('finishedLoading', __afterLoad);
                                } else {
                                    document.attachEvent('finishedLoading', __afterLoad);
                                }
                            };

                            stage.addEventListener('trashsignal', __listener, false);
                            sendAllToTrash(false, false);
                            if (planet !== undefined) {
                                planet.initialiseNewProject(files[0].name.substr(0, files[0].name.lastIndexOf('.')));
                            }

                            loading = false;
                            refreshCanvas();
                        } catch (e) {
                            console.debug(e);
                            errorMsg(_('Cannot load project from the file. Please check the file type.'));
                            document.body.style.cursor = 'default';
                            loading = false;
                        }
                    }
                }, 200);
            });

            // Work-around in case the handler is called by the
            // widget drag & drop code.
            if (files[0] != undefined) {
                reader.readAsText(files[0]);
                window.scroll(0, 0)
            }
        };

        var __handleDragOver = function (event) {
            event.stopPropagation();
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        };

        var dropZone = docById('canvasHolder');
        dropZone.addEventListener('dragover', __handleDragOver, false);
        dropZone.addEventListener('drop', __handleFileSelect, false);

        allFilesChooser.addEventListener('click', function (event) {
            this.value = null;
        });

        pluginChooser.addEventListener('click', function (event) {
            window.scroll(0, 0);
            this.value = null;
        });

        pluginChooser.addEventListener('change', function (event) {
            window.scroll(0, 0);

            // Read file here.
            var reader = new FileReader();

            reader.onload = (function (theFile) {
                loading = true;
                document.body.style.cursor = 'wait';
                doLoadAnimation();

                setTimeout(function () {
                    obj = processRawPluginData(reader.result, palettes, blocks, errorMsg, logo.evalFlowDict, logo.evalArgDict, logo.evalParameterDict, logo.evalSetterDict, logo.evalOnStartList, logo.evalOnStopList, palettes.pluginMacros);
                    // Save plugins to local storage.
                    if (obj != null) {
                        var pluginObj = preparePluginExports(obj);
                        // console.debug(pluginObj);
                        storage.plugins = pluginObj; // preparePluginExports(obj));
                    }

                    // Refresh the palettes.
                    setTimeout(function () {
                        if (palettes.visible) {
                            palettes.hide();
                        }

                        palettes.bringToTop();
                    }, 1000);

                    document.body.style.cursor = 'default';
                    loading = false;
                }, 200);
            });

            reader.readAsText(pluginChooser.files[0]);
        }, false);

        // Workaround to chrome security issues
        // createjs.LoadQueue(true, null, true);

        // Enable touch interactions if supported on the current device.
        createjs.Touch.enable(stage, false, true);

        // Keep tracking the mouse even when it leaves the canvas.
        stage.mouseMoveOutside = true;

        // Enabled mouse over and mouse out events.
        stage.enableMouseOver(10); // default is 20

        cartesianBitmap = _createGrid('data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(CARTESIAN))));
        polarBitmap = _createGrid('data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(POLAR))));

        var URL = window.location.href;
        var projectID = null;
        var flags = {
            run: false,
            show: false,
            collapse: false
        };

        // Scale the canvas relative to the screen size.
        _onResize(true);

        var urlParts;
        var env = [];

        if (!sugarizerCompatibility.isInsideSugarizer() && URL.indexOf('?') > 0) {
            var urlParts = URL.split('?');
            if (urlParts[1].indexOf('&') > 0) {
                var newUrlParts = urlParts[1].split('&');
                for (var i = 0; i < newUrlParts.length; i++) {
                    if (newUrlParts[i].indexOf('=') > 0) {
                        var args = newUrlParts[i].split('=');
                        switch (args[0].toLowerCase()) {
                            case 'file':
                                console.debug('Warning: old Music Blocks URLs will no longer work.');
                                break;
                            case 'id':
                                projectID = args[1];
                                break;
                            case 'run':
                                if (args[1].toLowerCase() === 'true')
                                    flags.run = true;
                                break;
                            case 'show':
                                if (args[1].toLowerCase() === 'true')
                                    flags.show = true;
                                break;
                            case 'collapse':
                                if (args[1].toLowerCase() === 'true')
                                    flags.collapse = true;
                                break;
                            case 'inurl':
                                var url = args[1];
                                var getJSON = function (url) {
                                    return new Promise(function (resolve, reject) {
                                        var xhr = new XMLHttpRequest();
                                        xhr.open('get', url, true);
                                        xhr.responseType = 'json';
                                        xhr.onload = function () {
                                            var status = xhr.status;
                                            if (status === 200) {
                                                resolve(xhr.response);
                                            } else {
                                                reject(status);
                                            }
                                        };
                                        xhr.send();
                                    });
                                };

                                getJSON(url).then(function (data) {
                                    // console.debug('Your JSON result is:  ' + data.arg);
                                    n = data.arg;
                                    env.push(parseInt(n));
                                }, function (status) {
                                    alert('Something went wrong reading JSON-encoded project data.');
                                });
                                break;
                            case 'outurl':
                                var url = args[1];
                                break;
                            default:
                                errorMsg(_('Invalid parameters'));
                                break;
                        }
                    }
                }
            } else {
                if (urlParts[1].indexOf('=') > 0) {
                    var args = urlParts[1].split('=');
                }

                //ID is the only arg that can stand alone
                if (args[0].toLowerCase() === 'id') {
                    projectID = args[1];
                }
            }
        }

        if (projectID != null) {
            setTimeout(function () {
                console.debug('loading ' + projectID);
                that.loadStartWrapper(that.loadProject, projectID, flags, env);
            }, 200); // 2000
        } else {
            setTimeout(function () {
                console.debug('load new Start block');
                that.loadStartWrapper(that._loadStart);
            }, 200); // 2000
        }

        prepSearchWidget();

        document.addEventListener('mousewheel', scrollEvent, false);
        document.addEventListener('DOMMouseScroll', scrollEvent, false);

        document.onkeydown = __keyPressed;
        _hideStopButton();
    };
};

activity = new Activity();

require(['domReady!', 'activity/sugarizer-compatibility'], function (doc) {
    if (sugarizerCompatibility.isInsideSugarizer()) {
        window.addEventListener('localized', function () {
            sugarizerCompatibility.loadData(function () {
                planet = document.getElementById('planet-iframe');
                planet.onload = function () {
                    activity.domReady(doc);
                };
            });
        });

        document.webL10n.setLanguage(sugarizerCompatibility.getLanguage());
    } else {
        activity.setupDependencies();
        activity.domReady(doc);
    }
});

define(MYDEFINES, function (compatibility) {
    activity.setupDependencies();
    activity.doContextMenus();
    activity.doPluginsAndPaletteCols();
});

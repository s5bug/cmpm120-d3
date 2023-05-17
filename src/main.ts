import 'phaser';

import IntroScene from "./scenes/01-intro.ts";

class SceneModuleFile extends Phaser.Loader.File {
    makeImport: () => Promise<{ default: typeof Phaser.Scene }>

    constructor(loader: Phaser.Loader.LoaderPlugin, key: string, makeImport: () => Promise<{ default: typeof Phaser.Scene }>) {
        super(loader, { type: 'sceneModule', key: key, url: '' });

        this.makeImport = makeImport;
    }

    load() {
        if(this.state == Phaser.Loader.FILE_POPULATED) {
            this.loader.nextFile(this, true)
        } else {
            let importScript: Promise<{ default: typeof Phaser.Scene }> =
                this.makeImport()

            importScript.then(module => {
                this.loader.scene.scene.add(this.key, module.default)
                this.onLoad()
            }).catch(() => this.onError())
        }
    }

    onLoad() {
        this.loader.nextFile(this, true)
    }

    onError() {
        this.loader.nextFile(this, false)
    }
}

class SceneModulePlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);

        pluginManager.registerFileType('sceneModule', this.sceneModuleCallback)
    }

    sceneModuleCallback(key: string, makeImport: () => Promise<{ default: typeof Phaser.Scene }>) {
        // @ts-ignore
        this.addFile(new SceneModuleFile(this, key, makeImport))
        return this
    }
}

class TtfFile extends Phaser.Loader.File {
    fontFamily: string
    ttfUrl: string
    fontObject: FontFace | undefined

    constructor(loader: Phaser.Loader.LoaderPlugin, family: string, url: string) {
        super(loader, { type: 'ttf', key: family, url: '' });
        this.fontFamily = family;
        this.ttfUrl = url;
    }

    load() {
        if (this.state === Phaser.Loader.FILE_POPULATED) {
            // @ts-ignore
            this.loader.nextFile(this, true)
        } else {
            this.fontObject = new FontFace(
                this.fontFamily,
                `url("${this.ttfUrl}")`
            )
            this.fontObject.load()
                .then(this.onLoad)
                // @ts-ignore
                .catch(() => this.onError())
        }
    }

    // @ts-ignore
    onLoad(ff: FontFace) {
        document.fonts.add(ff)
        // @ts-ignore
        this.loader.nextFile(this, true)
    }

    onError() {
        // @ts-ignore
        this.loader.nextFile(this, false)
    }
}

class TtfFilePlugin extends Phaser.Plugins.BasePlugin {
    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);

        pluginManager.registerFileType('ttf', this.ttfFileCallback)
    }

    ttfFileCallback(family: string, url: string) {
        // @ts-ignore
        this.addFile(new TtfFile(this, family, url))
        return this
    }
}

const game = new Phaser.Game({
    type: Phaser.WEBGL,
    plugins: {
        global: [
            { key: 'SceneModulePlugin', plugin: SceneModulePlugin, start: true },
            { key: 'TtfFilePlugin', plugin: TtfFilePlugin, start: true },
        ]
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    parent: 'app',
    fullscreenTarget: 'app',
    title: "CMPM D3",
    physics: {
        default: 'matter',
        matter: {
            enabled: true,
            debug: true,
            gravity: {
                x: 0,
                y: 0
            },
            positionIterations: 24,
            velocityIterations: 8,
        }
    },
    input: {
        activePointers: 5
    },
});

game.scene.add('intro', IntroScene, true)

declare global {
    interface Window { game: Phaser.Game }
}

window.game = game;

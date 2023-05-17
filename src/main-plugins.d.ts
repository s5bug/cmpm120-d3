declare namespace Phaser {
    namespace Loader {
        interface LoaderPlugin {
            ttf(family: string, url: string): this;
            sceneModule(key: string, makeImport: () => Promise<{ default: typeof Phaser.Scene }>): this;
        }
    }
}

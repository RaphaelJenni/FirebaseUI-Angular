import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

export interface Resource {
    name: string;
    type: "css" | "js";
    src: string;
}

export interface LoadedResource {
    [name: string]: {
        loaded: boolean,
        type: "css" | "js",
        src: string
    }
}

@Injectable()
export class DynamicLoaderService {

    private static ResourcesStore: Resource[] = [];
    private static LoadedResources: LoadedResource = {};

    private _document: Document | undefined = undefined;

    constructor(@Inject(DOCUMENT) _document?: any) {
        this._document = _document;

        DynamicLoaderService.ResourcesStore.forEach((res) => {
            DynamicLoaderService.LoadedResources[res.name] = {
                loaded: false,
                type: res.type,
                src: res.src
            };
        });
    }

    /**
     * Loads a series of previously registered Script(s)
     * @param resNames The list of resources to load
     */
    load(...resNames: string[]) {
        let promises: any[] = [];
        promises = resNames.map((name) => this.loadResource(name));
        return Promise.all(promises);
    }

    /**
     * Loads a script given it's name.
     * @param name Name of the script to laod.
     */
    loadResource(name: string) {
        return new Promise((resolve, reject) => {
            const resourceRef = DynamicLoaderService.LoadedResources[name];

            if (!resourceRef) {
                return reject({ resource: name, loaded: false, statusText: 'Resource not registered' });
            }

            if (resourceRef.loaded) {
                return resolve({ resource: name, loaded: true, statusText: 'Already Loaded' });
            }

            const tag = resourceRef.type === "js" ? this._document.createElement("script") : this._document.createElement("link");

            tag.onload = (e) => {
                resourceRef.loaded = true;
                return resolve({ resource: name, loaded: true, statusText: "Loaded", status: e });
            };

            tag.onerror = (error) => {
                return reject({ resource: name, loaded: false, statusText: 'Error', error: error });
            }

            if (tag instanceof HTMLScriptElement) {
                tag.type = "text/javascript";
                tag.src = resourceRef.src;
            }
            if (tag instanceof HTMLLinkElement) {
                tag.type = "text/css";
                tag.href = resourceRef.src;
                tag.rel = "stylesheet";
            }

            this._document.head.appendChild(tag);
        });
    }

    /**
     * Registers a series of Resource(s), without loading them
     * @param resources A list of Resource(s)
     */
    register(...resources: Resource[]) {
        resources.forEach(res => {
            DynamicLoaderService.ResourcesStore.push(res);
            DynamicLoaderService.LoadedResources[res.name] = {
                loaded: false,
                type: res.type,
                src: res.src
            };
        });
    }

    /**
     * Registers and then loads a list of Resource(s)
     * @param resource The list of resources
     */
    registerAndLoad(...resource: Resource[]) {
        const resName = resource.map(s => s.name);
        this.register(...resource);
        return this.load(...resName);
    }
}

import {
  BlobReader,
  BlobWriter,
  TextReader,
  TextWriter,
  ZipReader,
  ZipWriter,
  type Entry,
  type FileEntry,
} from "@zip.js/zip.js";
import type { ProjectHeader } from "./types";
import { mount, unmount } from "svelte";
import { project } from "./main.svelte";
import Toast from "../svelte/Toast.svelte";

export async function buildProjectZip(json: string) {
    const zipFileWriter = new BlobWriter();
    const jsonReader = new TextReader(JSON.stringify(json));
    const zipWriter = new ZipWriter(zipFileWriter);
    await zipWriter.add("project.json", jsonReader);
    const blob = await zipWriter.close();
    return blob;
}

export async function loadProjectJSON(zip: Blob) {
    const zipFileReader = new BlobReader(zip);
    const jsonWriter = new TextWriter();

    const zipReader = new ZipReader(zipFileReader);

    const entries = await zipReader.getEntries();
    const entry = entries.find(f => f.filename === "project.json");

    if (!entry) {
        const c = document.querySelector(".CodeArea");
        if (c) {
            const t = mount(Toast, {
                target: c,
                props: {
                    title: "Failed to load project",
                    text: "Unable to find a 'project.json' file in your HuopaBlocks project. Check if your project is corrupted!",
                    duration: 10000,
                    close: () => unmount(t)
                }
            });
        }
        throw new Error(`Unable to find project.json file in project zip, files: ${entries.map(f => f.filename).join(", ")}`);
    }

    const data = await new Promise<string>((resolve, reject) => {
        const writer = new TextWriter();
        (entry as FileEntry).getData!(writer).then(resolve).catch(reject);
    });

    const parsed = JSON.parse(JSON.parse(data));
    Object.assign(project, parsed);
}
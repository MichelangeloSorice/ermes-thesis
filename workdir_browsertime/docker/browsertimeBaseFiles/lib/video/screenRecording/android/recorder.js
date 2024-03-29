'use strict';
const convert = require('./convertToFps');
const os = require('os');
const util = require('util');
const fs = require('fs');
const path = require('path');
const get = require('lodash.get');
const log = require('intel').getLogger('browsertime.video');
const videoDefaults = require('../../defaults');
const {createAndroidConnection} = require('../../../android');
const delay = ms => new Promise(res => setTimeout(res, ms));
const unlink = util.promisify(fs.unlink);

async function createTempFile() {
    const mkdtemp = util.promisify(fs.mkdtemp);
    const dir = await mkdtemp(path.join(os.tmpdir(), 'browsertime-'));
    return path.join(dir, 'android.mp4');
}

module.exports = class AndroidRecorder {
    constructor(options) {
        this.waitTime = get(options, 'videoParams.androidVideoWaitTime', 5000);
        this.android = createAndroidConnection(options);
        this.framerate = get(
            options,
            'videoParams.framerate',
            videoDefaults.framerate
        );
        this.options = options;
    }

    async start() {
        return this.android.initConnection().then(() => this.android.startVideo());
    }

    async stop(destination) {
        log.debug('Stop screen recording');
        await this.android.stopVideo();
        // We want to wait some extra time for the video to land on the device
        await delay(this.waitTime);
        const tempFileLocation = await createTempFile();
        await this.android.pullVideo(tempFileLocation);
        // The destination file could exixt of we use --resultDir
        // so make sure we remove it first
        if (this.options.resultDir) {
            try {
                await unlink(destination);
            } catch (e) {
                // Nothing to see here
            }
        }
        await convert(tempFileLocation, destination, this.framerate);
    }
};

// Simple conductor
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class Conductor1 extends Conductor {
    constructor(mixer, sequencer, pitchTable) {
        super(mixer, sequencer, pitchTable);

        this.key = 4; // E
        this.scale = 5; // Minor scale
        this.scalePitches = this.generateDiatonicScalePitches(this.key, this.scale);
        console.log(this.scalePitches);
    }

    async setupEnsemble() {
        this.bass = new MonoSynth(this.mixer.context, this.pitchTable, synthPresets['bass']);
        this.synth = new PolySynth(this.mixer.context, this.pitchTable, synthPresets['pad']);
        this.drums = new DrumMachine(this.mixer.context);

        this.mixer.addChannel(this.bass);
        this.mixer.addChannel(this.synth);
        this.mixer.addChannel(this.drums);

        const kitInfo = [
            ['samples/808/808-bass-drum.mp3'], // 0
            ['samples/808/808-clap.mp3'], // 1
            ['samples/808/808-rim-shot.mp3'], // 2
            ['samples/808/808-snare.mp3'], // 3
            ['samples/808/808-closed-hat.mp3'], // 4
            ['samples/808/808-open-hat.mp3'], // 5
            ['samples/808/808-clave.mp3'], // 6
            ['samples/808/808-cymbal.mp3'], // 7
        ];

        await this.drums.loadKit(kitInfo);
    }

    play() {
        this.generators = {
            [this.drums.id]: new GDrums1(),
            [this.bass.id]: new GBass1(),
        };
        this.units = {
            [this.drums.id]: this.drums,
            [this.bass.id]: this.bass,
        };

        // Prepare sequencer
        this.sequencer.setBPM(120);
        this.sequencer.onPatternStart = (unitId) => {
            const newLoop = this.generators[unitId].nextLoop();
            this.sequencer.addLoop(this.units[unitId], newLoop);
        };

        // Add first loops
        for (const unitId in this.units) {
            this.sequencer.addLoop(this.units[unitId], this.generators[unitId].nextLoop());
        }

        this.sequencer.play();
    }

    stop() {
        this.sequencer.stop();
    }
}
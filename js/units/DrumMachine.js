// Drum Machine Unit
//
// Virtual Megus
// 2019-2020, Roman "Megus" Petrov

'use strict';

class DrumMachine extends Unit {
  constructor(context, kitInfo) {
    super(context, [], "drummach");

    this.kit = [];
    for (let c = 0; c < kitInfo.length; c++) {
      const sampleSet = kitInfo[c];
      let instrument = [];
      for (let d = 0; d < sampleSet.length; d++) {
        instrument.push(core.audioFileManager.audioBuffers[sampleSet[d]]);
      }
      this.kit.push(instrument);
    }

    this.gainNode = context.createGain();
    this.gainNode.gain.value = 1;
    this.output = this.gainNode;
  }

  playNote(time, note) {
    const pitch = note.pitch;
    const instrumentIdx = Math.floor(pitch / 12);
    const sampleIdx = pitch % 12;

    if (instrumentIdx >= this.kit.length || sampleIdx >= this.kit[instrumentIdx].length) {
      return
    }

    const sampleNode = this.context.createBufferSource();
    const ampNode = this.context.createGain();

    ampNode.gain.value = note.velocity;

    sampleNode.buffer = this.kit[instrumentIdx][sampleIdx];

    sampleNode.connect(ampNode);
    ampNode.connect(this.gainNode);
    sampleNode.start(time);
  }
}

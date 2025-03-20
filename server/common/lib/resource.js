export class Resource {
  constructor(data) {
    this.data = data;
  }

  static async make(data) {
    return await new this(data).toArray();
  }

  async toArray() {
    if (Array.isArray(this.data)) {
      return await Promise.all(
        this.data.map(async (item) => await this.transform(item?.toJSON()))
      );
    }
    return await this.transform(this.data?.toJSON());
  }

  toJSON() {
    return JSON.stringify(this.toArray());
  }

  async transform(item) {
    return item;
  }

  formatDate(date, format = 'D, M d, Y - H:m:s a') {
    if (!date) return '';
    const formatMapping = {
      M: { month: 'short' }, // Jan
      d: { day: '2-digit' }, // 01
      Y: { year: 'numeric' }, // 2023
      H: { hour: '2-digit' }, // 12
      m: { minute: '2-digit' }, // 00
      s: { second: '2-digit' }, // 00
      a: { hour12: true }, // PM
      D: { weekday: 'short' }, // Mon
    };
    const options = {};

    for (const char of format) {
      if (formatMapping[char]) {
        Object.assign(options, formatMapping[char]);
      }
    }
    return new Date(date).toLocaleString('en-US', options);
  }

  static async collection(data) {
    if (!data) return [];
    return await Promise.all(
      data.map(async (item) => await new this(item).toArray())
    );
  }
}

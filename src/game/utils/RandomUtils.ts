export class RandomUtils {
  public static createId(length: number = 6) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV0123456789';

    let id = '';
    for (let i = 0; i < length; i++) {
      const rnd = Math.floor(Math.random() * characters.length);
      id += characters.charAt(rnd);
    }

    return id;
  }

  public static randomRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}

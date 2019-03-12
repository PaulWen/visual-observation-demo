/**
 * This class defines constants which can be used to configure the application.
 */
export class AppConfig {

////////////////////////////////////////////Properties////////////////////////////////////////////

  public static get DEVELOPMENT(): boolean {
    return true;
  };

  public static get STORAGE_KEY_UPDATE_INTERVAL(): string {
    return "updateInterval";
  };
  public static get STORAGE_UPLOAD_URL(): string {
    return "uploadUrl";
  };

  public static get LOREM_IPSUM(): string {
    return "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
  };

}

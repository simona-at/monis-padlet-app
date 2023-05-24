import {Padlet} from "./padlet";

export class PadletFactory {

  /**
   * Diese Methode erzeugt ein leeres Padlet-Objekt, indem sie einen neuen Padlet-Instanz erstellt und die Eigenschaften
   * mit Standardwerten initialisiert. Das zurückgegebene Padlet-Objekt hat eine ID von 0, einen leeren Titel,
   * is_private auf false, ein aktuelles Datum, eine leere Beschreibung, eine leere Liste von Bildern, Benutzern, Kommentaren und Likes.
   */
  static empty() : Padlet{
    return new Padlet(0, '', false, new Date(), '', [{id: 0, url:'',title: ''}], [], [], []);
  }

  /**
   * Diese Methode erzeugt ein Padlet-Objekt aus einem rohen JavaScript-Objekt (rawPadlet). Sie extrahiert die relevanten
   * Eigenschaften aus dem rawPadlet-Objekt und erstellt eine neue Padlet-Instanz mit diesen Eigenschaften. Die Methode
   * überprüft auch den Datentyp des created_at-Eigenschafts, um sicherzustellen, dass es ein Date-Objekt ist.
   * Wenn es ein string ist, wird es in ein Date-Objekt konvertiert. Das zurückgegebene Padlet-Objekt enthält die entsprechenden
   * Eigenschaften aus dem rawPadlet-Objekt.
   * @param rawPadlet
   */
  static fromObject(rawPadlet:any) : Padlet {
      return new Padlet(
        rawPadlet.id,
        rawPadlet.title,
        rawPadlet.is_private,
        typeof(rawPadlet.created_at) === 'string' ? new Date(rawPadlet.created_at) : rawPadlet.created_at,
        rawPadlet.description,
        rawPadlet.images,
        rawPadlet.users,
        rawPadlet.comments,
        rawPadlet.likes
      );
  }

}

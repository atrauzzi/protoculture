export interface FieldDictionary {
    [key: string]: string[];
}

export interface ValidationData {

    errors: string[];

    fields: FieldDictionary;

}

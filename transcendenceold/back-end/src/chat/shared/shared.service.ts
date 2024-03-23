/* eslint-disable prettier/prettier */

export class SharedService {
    static AllSockets    :    string[] = [];
    static UsersSockets  :    Map<string, string[]> = new Map();
    static mutedUsers    :    Map<string, Map<string, NodeJS.Timeout>> = new Map();
}
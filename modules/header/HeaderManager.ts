import type { Guild, User } from "discord.js";
import { GoogleSpreadsheet } from "google-spreadsheet"
import { action, observable } from "mobx"

export class HeaderManager {
    @observable googleUser = "google";
    @observable discordUser: User | null = null;
    @observable sheetId = ""
    @observable guild?: Guild | null = null;
    @observable 

    @action handleEvent = console.log

    @action loginGoogle() {

    }

    @action loginDiscord() {

    }

    @action pickSheet() {

    }

    constructor() {

    }
}
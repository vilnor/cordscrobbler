import { RegisteredUser } from './users-service';
import { Pool } from 'pg';

export class DatabaseService {
    private pool: Pool;

    constructor() {
        // this pulls connection details form environment variables
        this.pool = new Pool();
    }

    async retrieveAllRegisteredUsers() {
        const { rows } = await this.pool.query('SELECT * FROM registered_users');
        return rows;
    }

    async setRegisteredUser(registeredUser: RegisteredUser) {
        await this.pool.query(
            "INSERT INTO registered_users (discordUserId, lastfmUserName, lastfmSessionKey, isScrobbleOn, sendNewsMessages, registrationTimestamp) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (discordUserId) DO UPDATE SET lastfmUserName = $2, lastfmSessionKey = $3, isScrobbleOn = $4, sendNewsMessages = $5, registrationTimestamp = $6",
            [
                registeredUser.discordUserId,
                registeredUser.lastfmUserName,
                registeredUser.lastfmSessionKey,
                JSON.stringify(registeredUser.isScrobbleOn),
                JSON.stringify(registeredUser.sendNewsMessages),
                JSON.stringify(registeredUser.registrationTimestamp),
            ]
        );
    }

    async getRegisteredUser(discordUserId: string) {
        const { rows } = await this.pool.query('SELECT * FROM registered_users where discordUserId = $1', [discordUserId]);
        if (!rows.length) {
            throw new Error('UserNotExistsInDatabase')
        }

        return rows[0];
    }

    async deleteRegisteredUser(discordUserId: string) {
        await this.pool.query('DELETE FROM registered_users where discordUserId = $1', [discordUserId]);
    }
}
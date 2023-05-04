import {Router} from 'express';

export const moviesRouter = Router();

const usersRouter = Router();
export const router = {
    auth: Router(),
    users: usersRouter,
    movies: Router(),
    reviews: Router(),
};

export class ApiRouter {
    private static instance?: ApiRouter;
    private _auth: Router;
    private _users: Router;
    private _movies: Router;
    private _reviews: Router;

    private constructor() {
    }

    private _api: Router;

    public get api() {
        return this._api;
    }

    public static getInstance() {
        if (this.instance === undefined) {
            const r = new ApiRouter();
            r._api = Router();
            r._auth = Router();
            r._users = Router();
            r._movies = Router();

            const {_api} = r;
            _api.use('/auth', r._auth);
            _api.use('/users', r._users);
            _api.use('/movies', r._movies);

            this.instance = r;
        }
        return this.instance;
    }
}

'use strict';


class Server {

    static get dependencies() {

        return [ 'config', 'koa' ];

    }

    constructor( config, koa ) {

        this.config = config;
        this.koa    = koa;

    }

    start() {

        this.koa.listen( 3000 );

        console.log( this.config.get( 'database.knex.host' ) );

    }


}


module.exports = Server;

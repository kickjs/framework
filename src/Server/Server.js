'use strict';


class Server {

    static get services() {

        return [ 'config', 'koa', 'router' ];

    }

    constructor( services ) {

        Object.assign( this, services );

    }

    start() {

        this.koa
            .use( this.router.routes() )
            .use( this.router.allowedMethods() )
            .listen( 3000 );

    }


}


module.exports = Server;

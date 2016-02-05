'use strict';


class Server {

    static get services() {

        return [ 'App', 'Koa', 'Router' ];

    }

    constructor( services ) {

        Object.assign( this, services );

    }

    start() {

        this.Koa
            .use( this.Router.routes() )
            .use( this.Router.allowedMethods() )
            .listen( 8000 );

    }


}


module.exports = Server;

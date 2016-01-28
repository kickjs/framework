'use strict';

const _       = require( 'lodash' );
const Co      = require( 'co' );
const Promise = require( 'bluebird' );
const Glob    = Promise.promisify( require( 'glob' ) );


class Config {

    static get services() {

        return [ 'env' ];

    }

    constructor( services ) {

        Object.assign( this, services, {
            config: {}
        } );

    }

    get( ...args ) {

        return _.get( this.config, ...args );

    }

    set( ...args ) {

        return _.set( this.config, ...args );

    }

    has( ...args ) {

        return _.has( this.config, ...args );

    }

    load() {

        return Co( function *() {

            let paths = [];
            let path  = _.get( this.env, 'paths.app' );
            let mode  = _.get( this.env, 'mode', 'development' );

            if ( path )
            {
                paths.push( path + '/Config' );

                if ( mode )
                {
                    paths.push( path + '/Config' + mode );
                }
            }

            let configs = yield paths.map( path => this._load( path ) );

            configs.forEach( config => {

                merge( this.config, config );

            } );

        }.bind( this ) );

    }

    _load( path ) {

        return Co( function *() {

            let config = {};
            let files  = yield Glob( '*.js', { cwd: path, nomount: true } );

            files.forEach( file => {

                let name = _.chain( file )
                    .replace( /\.js$/gi, '' )
                    .trim( '\\\/' )
                    .value();

                config[ name ] = require( path + '/' + file );

            } );

            return config;

        }.bind( this ) );

    }

}


function merge( a, b ) {

    if ( !_.isPlainObject( a ) || !_.isPlainObject( b ) )
    {
        return b;
    }

    return _.merge( a, b, merge );

}


module.exports = Config;

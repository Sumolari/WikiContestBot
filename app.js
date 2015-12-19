var framework = require( './framework.js' ),
  _ = require( 'lodash' ),
  fs = require( 'fs' ),
  moment = require( 'moment' ),
  users = require( './wikiusers.json' ),
  BBPromise = require( 'bluebird' ),
  minDate = moment( '2015-11-7', 'YYYY-MM-DD' ),
  maxDate = moment( '2015-12-7', 'YYYY-MM-DD' ),
  CSVOutput =
  '"User";"Project";"Article URL";"Article name";"Bytes added";"New article";"Score"\n';

BBPromise.each( users, function ( user ) {

    return framework
      .getUserContributionsInAllProjects( user, minDate, maxDate )
      .then( function ( contributions_and_projects ) {

        var total_bytes_added = 0,
          total_score = 0,
          total_new_articles = 0,
          total_contributions = 0;

        _.forEach(
          contributions_and_projects,
          function ( contributions,
            project_key ) {

            total_contributions += Object.keys( contributions )
              .length;

            _.forEach( contributions, function ( contribution ) {

              CSVOutput += '"' + user + '";';
              CSVOutput += '"' + project_key + '";';
              CSVOutput += '"' + contribution.url + '";';
              CSVOutput += '"' + contribution.page + '";';
              CSVOutput += '"' + contribution.bytesDelta + '";';
              CSVOutput += '"' + contribution.newArticle + '";';
              CSVOutput += '"' + contribution.score() + '"\n';

              total_bytes_added += contribution.bytesDelta;
              total_score += contribution.score();
              if ( contribution.newArticle ) {
                total_new_articles++;
              }

            } );

          } );

        CSVOutput += '"' + user + '";';
        CSVOutput += '"[All]";';
        CSVOutput += '"[None]";';
        CSVOutput += '"' + total_contributions + '";';
        CSVOutput += '"' + total_bytes_added + '";';
        CSVOutput += '"' + total_new_articles + '";';
        CSVOutput += '"' + total_score + '"\n';

      } );

  } )
  .then( function () {
    console.log( 'Everything is OK!'.green );
    fs.writeFileSync( 'results.csv', CSVOutput );
    console.log( '' );
    console.log( 'Data is available on', 'results.csv'.bold.underline.green );
  } );

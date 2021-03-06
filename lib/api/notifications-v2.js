'use strict';

var consts = require('../constants');

function configure (app, ctx) {
  var express = require('express')
    , api = express.Router( )
    ;

  api.use(ctx.wares.compression());
  api.use(ctx.wares.rawParser);
  api.use(ctx.wares.bodyParser.json({
      limit: '50Mb'
  }));
  api.use(ctx.wares.urlencodedParser);
  
  api.post('/loop', ctx.authorization.isPermitted('notifications:loop:push'), function (req, res) {
    ctx.loop.sendNotification(req.body, req.connection.remoteAddress, function (error) {
      if (error) {
        res.status(consts.HTTP_INTERNAL_ERROR).send(error)
        console.log("error sending notification to Loop: ", error);
      } else {
        res.sendStatus(consts.HTTP_OK);
      }
    });
  });

  return api;
}
module.exports = configure;

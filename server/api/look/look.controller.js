'use strict';

var _ = require('lodash');
var Look = require('./look.model');
var path = require('path');
var express = require('express');
var utils = require('../../utils/utils.js');

exports.allLooks = function(req, res) {
  Look.find({})
    .sort({
      createTime: -1
    })
    .exec(function(err, looks) {
      if (err) {
        return handleError(res, err);
      }
      if (!looks) {
        return res.send(404);
      }
      console.log(looks);
      return res.status(200)
        .json(looks);
    });
};

exports.scrapeUpload = function(req, res) {
  var random = utils.randomizer(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

  utils.downloadURI(req.body.image, '../client/assets/images/uploads/' + random + '.png', function(filename) {
    console.log('done');

    var newLook = new Look();
    newLook.title = req.body.title;
    newLook.image = filename.slice(9);
    newLook.email = req.body.email;
    newLook.linkURL = req.body.linkURL;
    newLook.description = req.body.description;
    newLook.userName = req.body.name;
    newLook._creator = req.body._creator;
    newLook.createTime = Date.now();
    newLook.upVotes = 0;
    newLook.save(function(err, item) {
      if (err) {
        console.log('error occured in saving post');
      } else {
        console.log('Success post saved');
        console.log(item);
        res.status(200)
          .send(item);
      }
    });
  });
}

exports.upload = function(req, res) {
  var newLook = new Look();
  var fileimage = req.middlewareStorage.fileimage;

  console.log(req.body);
  newLook.image = '/assets/images/uploads/' + fileimage;
  newLook.email = req.body.email;
  newLook.linkURL = req.body.linkURL;
  newLook.title = req.body.title;
  newLook.description = req.body.description;
  newLook.userName = req.body.name;
  newLook._creator = req.body._creator;
  newLook.createTime = Date.now();
  newLook.upVotes = 0;

  newLook.save(function(err, look) {
    if (err) {
      console.log('error saving look ');
      return res.send(500);
    } else {
      console.log(look);
      console.log('Look Saved to DB ');
      res.status(200)
        .send(look);
    }
  });
};
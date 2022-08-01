const { selectTopics } = require("../models/topics.models");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    res.send(topics);
  });
};

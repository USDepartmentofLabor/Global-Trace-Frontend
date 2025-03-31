#!/bin/bash
set -e

escape(){
  VALUE=${1/\//""};
  VALUE=${VALUE/\"/""};
  VALUE=${VALUE/\\/""};
  echo $VALUE;
}

MESSAGE='{ "blocks": [ { "type": "section", "text": { "type": "mrkdwn", "text": "[FE] __ICON__   __CONTENT__ *#__CI_PIPELINE_ID__*" }, "accessory": { "type": "button", "text": { "type": "plain_text", "text": "View details", "emoji": true }, "value": "click_me_123", "url": "__URL__", "action_id": "button-action" } }, { "type": "context", "elements": [ { "type": "mrkdwn", "text": ":farmer: *__GITLAB_USER_NAME__* commited." } ] }, { "type": "context", "elements": [ { "type": "mrkdwn", "text": "``` __CI_COMMIT_MESSAGE__ ```" } ] } ] }'

ICON=':white_circle:'

case $1 in

  warn)
    ICON=':large_orange_circle:'
    ;;

  success)
    ICON=':large_green_circle:'
    ;;

  danger)
    ICON=':red_circle:'
    ;;

  info)
    ICON=':large_blue_circle:'
    ;;

  deployinfo)
    ICON=':place_of_worship:'
    ;;

  deploydanger)
    ICON=':sos:'
    ;;

  deploysuccess)
    ICON=':dollar:'
    ;;

  testdanger)
    ICON=':broken_heart:'
    ;;
esac

MESSAGE="${MESSAGE/__ICON__ /$ICON}"

CONTENT=$(escape "${2}");

MESSAGE="${MESSAGE/__CONTENT__/$CONTENT}"

MESSAGE="${MESSAGE/__URL__/$CI_JOB_URL}"

MESSAGE="${MESSAGE/__CI_PIPELINE_ID__/$CI_PIPELINE_ID}"

CI_COMMIT_MESSAGE_ESC=$(escape "${CI_COMMIT_MESSAGE}");
MESSAGE="${MESSAGE/__CI_COMMIT_MESSAGE__/$CI_COMMIT_MESSAGE_ESC}"

GITLAB_USER_NAME_ESC=$(escape "${GITLAB_USER_NAME}");
MESSAGE="${MESSAGE/__GITLAB_USER_NAME__/$GITLAB_USER_NAME_ESC}"

curl -X POST -H 'Content-type: application/json' --data "${MESSAGE}" $SLACK_WEBHOOK

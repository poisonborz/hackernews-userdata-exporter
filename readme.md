

# <img width="23" src="https://raw.githubusercontent.com/poisonborz/hackernews-userdata-exporter/main/src/icon.ico"> Hacker News User Data Exporter


[![Build](https://github.com/poisonborz/hackernews-userdata-exporter/actions/workflows/build.yml/badge.svg)](https://github.com/poisonborz/hackernews-userdata-exporter/actions/workflows/build.yml) [![Test](https://github.com/poisonborz/hackernews-userdata-exporter/actions/workflows/test.yml/badge.svg)](https://github.com/poisonborz/hackernews-userdata-exporter/actions/workflows/test.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

A utility that exports a user's (publicly available) data and submissions on the online message board [Hacker News](https://news.ycombinator.com/). It can be used to regularly export your own data in both user and machine-readable format (as in a GDPR data request) since Hacker News does not provide such functionality. Uses the official FireBase API.

**To use it:**
- **either visit the [website](https://poisonborz.github.io/hackernews-userdata-exporter/src/) hosted from this repository**
- **or download the latest (x64) command line utility on the [Release](https://github.com/poisonborz/hackernews-userdata-exporter/releases/latest) page.**

The utility extends [userdata exporter](https://github.com/poisonborz/userdata-exporter), which you can use to create similar utilities.

_This is an open source project in no way affiliated with Hacker News or YCombinator._


## Command line usage

Example:
`HNUserDataExporter username=USERNAME mode=MODE output=OUTPUTPATH`

- **username** - user name of the Hacker News user to export. Case sensitive. The user has to have a publicly available profile.
- **mode** Optional.
  - _html_ - Generate a human readable `hn_export_USERNAME_DATE.html` file. As of now contains only story submissions and comments.
  - _json_ - Generate a machine readable `hn_export_USERNAME_DATE.json` file with the structure below.
  - _both_ - Default. Generate both files above.
- **outputPath** - Optional. File path for the output files. Outputs to the root of the executable location when not specified.


### Output JSON structure

Includes a distinct `user` property, and for submissions - instead of an id list - a separate per-type node (`comments`, `posts`, `polls`, `jobs`) node.
For comment and poll item types, `parent` and `parts` include the full item list instead of id-s. Apart from this, items match the [API spec](https://github.com/HackerNews/API).

_Note, as per HN API policy, comment points/scores are not available_

```json
{
    "user": {
        "created": 946684800000,
        "id": "USERID",
        "karma": 100
    },
    "comment": [
        {
            "id": 111111,
            "by": "USERID",
            "text": "...",
            "time": 946684800000,
            "kids" : [ 111, 222],
            "parent": {
                "type": "comment | story | job | poll",
                "...same comment or post structure as respective type": ""
            }
        }
    ],
    "story": [
        {
            "id": 111111,
            "by": "USERID",
            "text": "...",
            "title": "...",
            "type": "story",
            "url": "https://www.example.com",
            "time": 946684800000,
            "score": 100,
            "kids" : [ 111, 222],
            "descendants": 100
        }
    ],
    "poll": [
        {
            "id" : 111111,
            "by" : "pg",
            "descendants" : 54,
            "kids" : [ 111, 222],
            "parts" : [
                {
                    "by" : "USERID",
                    "id" : 111111,
                    "poll" : 111111,
                    "score" : 335,
                    "text" : "...",
                    "time" : 1207886576,
                    "type" : "pollopt"
                },
                {
                    "...": "..."
                }
            ],
            "score" : 46,
            "text" : "",
            "time" : 1204403652,
            "title" : "Poll: What would happen if News.YC had explicit support for polls?",
            "type" : "poll"
        }
    ],
    "job": [
        {
            "by" : "USERID",
            "id" : 111111,
            "score" : 6,
            "text" : "...",
            "time" : 1210981217,
            "title" : "...",
            "type" : "job",
            "url" : ""
        }
    ]
}
```

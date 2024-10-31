#!/bin/bash
# Usage:
#   ./test.sh _download_one $ID 
#   ./test.sh _run_one $ID
#   ./test.sh _diff_one $ID
# Pour regéner la progression:
#   ./test.sh _corpus100_download
#   ./test.sh _corpus100_run
#   ./test.sh _corpus100_show_progress

TMPDIR=../../tmp/dpe
mkdir -p $TMPDIR
GITDIR=$(git rev-parse --show-toplevel)

_download_one() {
    ID=$1
    XML=$TMPDIR/$ID.orig.xml
    BEFORE=$TMPDIR/$ID.orig.json
    USER_AGENT="Mozilla/5.0 (X11; Linux x86_64; rv:60.0) Gecko/20100101 Firefox/81.0"
    # if the file already exists, don't download it again
    if [ -s $BEFORE ]; then
        return
    fi
    echo "downloading $ID"
    curl -A "${USER_AGENT}" --silent "https://observatoire-dpe-audit.ademe.fr/pub/dpe/${ID}/xml" > $XML
    ./xml_to_json.js > $BEFORE
}

_index_many() {
    Q=$1
    url=https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?q=\"$Q\"

    while [ "$url" != "null" ]; do
        echo $url
        curl -s "$url" | jq -r '.results[]."N°DPE"' | while read ID; do
            _index_one "$ID" &
        done
        wait
        url=$(curl -s "$url" | jq -r '.next')
    done
}

_run_one() {
    ID=$1
    AFTER=$TMPDIR/$ID.open3cl.json
    BEFORE=$TMPDIR/$ID.orig.json
    ERRLOG=$TMPDIR/$ID.err.log

    $GITDIR/test/run_one_dpe.js \
        $BEFORE \
        >$AFTER \
        2>$ERRLOG
}

_diff_one() {
    ID=$1
    JSONPATH=$2

    if [ -z "$JSONPATH" ]; then
        JSONPATH="."
    fi

    AFTER=$TMPDIR/$ID.open3cl.json
    BEFORE=$TMPDIR/$ID.orig.json
    _filter() { 
        # remove all objects that have a field named "donnee_utilisateur"
        # and sort the keys alphabetically in objects
        jq -S "$JSONPATH | del(.. | .donnee_utilisateur?)"
    }

    json-diff -Csf <(cat $BEFORE | _filter) <(cat $AFTER | _filter)
}

_compare_one() {
    ID=$1
    BEFORE=$TMPDIR/$ID.orig.json
    AFTER=$TMPDIR/$ID.open3cl.json
    ERRLOG=$TMPDIR/$ID.err.log
    OKPATHS=$TMPDIR/$ID.ok

    jq -f flatten.jq $AFTER > $AFTER.flat
    jq -f flatten.jq $BEFORE > $BEFORE.flat

    # generate a json file with the substraction of the keys for each value with jq
    jq -n --argfile before $BEFORE.flat --argfile after $AFTER.flat -f diff.jq > $TMPDIR/$ID.ok.json
}

_corpus100_download() {
    # all IDS in corpus100.txt
    cat corpus100.txt | while read ID; do
        _download_one $ID
    done
}

_corpus100_run() {
    IDS=$(cat corpus100.txt)
    for ID in $IDS; do
        echo "running $ID"
        { _run_one $ID; _compare_one $ID; } &
    done
    wait
}

_corpus100_compare() {
    IDS=$(cat corpus100.txt)
    for ID in $IDS; do
        _compare_one $ID &
    done
    wait
}

_corpus100_show_progress() {
    jq -r 'to_entries[] | select(.value == "OK") | .key' /tmp/dpe/*.ok.json | sort | uniq -c | sort -nr | awk '{printf "%s%% %s\n", $1, $2}'
}

_help() {
    # list all functions in the current file
    grep "^_.*()" $0 | sed 's/()//' | sort
}

# run command if function exists or run _help
if [ -n "$1" ]; then
    "$@"
else
    _help
fi

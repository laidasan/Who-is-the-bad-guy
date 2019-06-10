{
    let button_group = document.querySelector('.button-group');
    let page_container = document.querySelector('.container');
    let page_previous_array = [];
    let page_previous;
    let pre_href;
    let player_conunt = 0;
    let ischecked = false;
    let count = 0; //show出謎底給玩家看時紀數

    let group = document.querySelector('.group');
    let range_ary = document.querySelectorAll('.range');
    let range_val_ary = document.querySelectorAll('.range-value');

    let game_info = []; //gamers bad white [custom(0) or default(1)]

    const answer_default = ['橘子,柳丁', '機車,汽車'];
    const answer_checkit = []; //[臥底,平民]
    const player = [];  //人數六人中誰為民誰為臥 0 民;1 臥
    let bad_remaining;
    let good_remaining;
    let gameover = false;


    /*previous button*/
    let button_previous = document.createElement('a');
    button_previous.setAttribute('href', '#previous');
    button_previous.style = 'margin-right:15px;';
    button_previous.className = 'button';
    button_previous.innerText = 'pre';
    /*previous button*/

    /*check next_button*/
    let button_next = document.createElement('a');
    button_next.setAttribute('href', '#next');
    button_next.className = 'button';
    button_next.innerText = '點我';
    /*check next_button*/

    /*check player-ans*/
    let p_ans = document.createElement('p');
    p_ans.className = 'player-ans u-margin-bottom-medium';
    // p_ans.innerText = '橘子';
    /*checkt player-ans*/

    let page_answer = `<form class="form">
                            <div class="group">
                                <div class="wrap u-margin-bottom-big">
                                    <h2 class="heading-secondary">自訂</h2>
                                    <input type="radio" name="radio" id="custom" class="radio-button radio-custom">
                                    <label for="custom" class="radio-label custom"></label>
                                    <input type="text" class="radio-text">
                                    <input type="text" class="radio-text radio-text-2">
                                </div>
                            </div>
                            <div class="group">
                                <div class="wrap u-margin-bottom-medium">
                                    <h2 class="heading-secondary">預設</h2>
                                    <input type="radio" name="radio" id="default" class="radio-button radio-default" checked>
                                    <label for="default" class="radio-label default"></label>
                                </div>
                            </div>
                        </form>`;


    let page_checkit = `<h2 class="heading-secondary u-margin-bottom-medium">玩家1</h2>
    <p class="player-ans u-margin-bottom-medium">橘子</p>
    <p class="player-info u-margin-bottom-medium">點擊看謎底，再點擊隱藏給下一位玩家</p>`;

    let page_checkit2 = `<h2 class="heading-secondary u-margin-bottom-medium">玩家1</h2>
    <p class="player-info u-margin-bottom-medium">點擊看謎底，再點擊隱藏給下一位玩家</p>`;

    let page_gaming = `<div class="player-wrap u-margin-bottom-medium"></div>`;


    let teacherA;
    let teacherB;
    function test() {
        console.log(teacherA + ', ' + teacherB);
    };
    test();

    /*取亂數 0~value_range*/
    function getRandom(value_range) {
        value_range = value_range || 20;
        return Math.floor(Math.random() * (value_range + 1));
    }

    /*決定玩家謎底(誰是臥底)*/
    function decideSpy() {
        let bad_count = 0;
        let good_count = 0;
        let notfull = true;

        // const answer = answer_default[getRandom(answer_default.length - 1)];
        const decide = [];
        for (let i = 0; i < game_info[0]; i++) {
            console.log('first roop');
            if (bad_count == game_info[1] || good_count == (game_info[0] - game_info[1])) {
                console.log('break');
                break;
            } else {
                console.log('decide');
                /*決定是否為臥地--取10個變數*/
                for (let j = 0; j < 10; j++) {
                    decide.push(getRandom(100));  //取0~100Random 10個，一半超過50為臥底
                }
                let decide_ans = decide.filter(function (value) {
                    return value > 50;
                })
                if (decide_ans.length > 5) {
                    player.push(1);
                    bad_count++;
                } else {
                    player.push(0);
                    good_count++;
                }
                decide.length = 0;
            }
        }

        /*沒有填滿的話填滿*/
        while (notfull) {
            if (player.length == game_info[0]) {
                notfull = false;
                console.log('isfull');
            } else if (bad_count == game_info[1]) {
                player.push(0);
                console.log('放入民');
            } else {
                player.push(1);
                console.log('放入臥底');
            }
        }
        console.log(player);
        return player;
    }


    /*決定謎底*/
    function decideAnswer() {
        let an = [];
        if (game_info[3] == 1) {
            an = answer_default[getRandom(answer_default.length - 1)].split(',');
            return an;
        } else {
            console.log('custom');
            an = answer_default[getRandom(answer_default.length - 1)].split(',');
            return an;
        }
    }
    // console.log(decideAnswer());
    // console.log(decideAnswer()[0]);

    /*決定謎底哪個詞為臥底*/
    function decideBadAnswer() {
        let an = decideAnswer();
        let an1 = []
        let an2 = []
        for (let i = 0; i < 100; i++) {
            an1.push(getRandom(100));
            an2.push(getRandom(100));
        }
        console.log(an1);
        console.log(an2);
        an1_up = an1.filter(function (value) {
            return value > 50;
        })
        an2_up = an2.filter(function (value) {
            return value > 50;
        })
        console.log(an1_up.length);
        console.log(an2_up.length);
        if (an1_up.length >= an2_up.length) {
            answer_checkit.push(an[0]);
            answer_checkit.push(an[1]);
        } else if (an1_up.length < an2_up.length) {
            answer_checkit.push(an[1]);
            answer_checkit.push(an[0]);
        }
        an1.length = 0;
        an2.length = 0;
        console.log('decideBadguy');
        return answer_checkit;
    }

    /*Show出玩家的謎底*/
    function showPlayer(count) {
        switch (player[count]) {
            case 1:
                p_ans.innerText = answer_checkit[1];
                page_container.insertBefore(p_ans, page_container.children[1]);
                break;
            case 0:
                p_ans.innerText = answer_checkit[0];
                page_container.insertBefore(p_ans, page_container.children[1]);
                break;
            default:
                console.log("fail");
                break;
        }
    }

    function showAll() {
        player.forEach(function (answer, index) {
            console.log('player' + (index + 1) + ':' + answer_checkit[answer]);
        })
    }



    /*白板開關轉換*/
    function isopen(value) {
        let isopen_str;
        switch (value) {
            case '0':
                // range_val_white.innerText = '關';
                isopen_str = '關';
                break;
            case '1':
                // range_val_white.innerText = '開';
                isopen_str = '開';
                break;
            default:
                console.log('檢查傳入型態(需為字串)，或是傳入值不為0或1');
                break;
        }
        return isopen_str;
    }

    //清空
    function clearInfo() {
        player.length = 0;
        player_conunt = 0;
        count = 0;
        ischecked = false;
        answer_checkit.length = 0;
        game_info.length = 0;
        gameover = false;
        console.log('clear');
    }


    //add gaming player 
    function addPlayer() {
        function player(player_str) {
            let player_a = document.createElement('a');
            player_a.className = 'player u-margin-bottom-medium';
            player_a.setAttribute('href', '#');
            player_a.textContent = player_str;
            return player_a;
        }

        let player_wrap = document.querySelector('.player-wrap');
        console.log(player_wrap);
        for (let i = 0; i < game_info[0]; i++) {
            let player_str = '玩家';
            player_str = player_str + (i + 1).toString();
            player_wrap.appendChild(player(player_str));
            console.log('addSucess');
        }
    }

    
    //check game is over?
    function checkWinner(bad_remaining, good_remaining) {
        if (bad_remaining == 0 || (bad_remaining == 1 && good_remaining == 1)) {
            window.alert('平民獲勝\n' + '平民:' + answer_checkit[0] + '\n臥底:' + answer_checkit[1]);
            gameover = true;
        } else if (good_remaining == 0) {
            window.alert('臥底獲勝');
            gameover = true;
        } else {
            console.log('game continute!');
        }
    }

    

    //show player who was killed.
    function kill(e) {

        let target = e.target;
        e.preventDefault();
        if (target.classList[0] === 'player') {
            let player_str = target.textContent;
            console.log(bad_remaining);
            console.log(good_remaining);
            if (window.confirm('really? you sure?')) {
                let player_num = player_str.split('玩家')[1];
                switch (player[player_num - 1]) {
                    case 0:
                        target.textContent = '平民';
                        good_remaining--;
                        break;
                    case 1:
                        target.textContent = '臥底';
                        bad_remaining--;
                        break;
                    default:
                        console.log('殺');
                        break;
                }
            } else {
                console.log('不殺了不殺了');
            }
        }
        checkWinner(bad_remaining,good_remaining);
    }

    //CheckGameOver
    function checkGameOver(e) {
        if(gameover != true) {
            kill(e);
        }else {
            console.log('Game is over!');
        }
    }
    
    /*選擇人數--改變range後數字*/
    function range_change(e) {
        let target = e.target;
        if (target.classList[0] === 'range') {
            switch (target.getAttribute('name')) {
                case 'gamers':
                    range_val_ary[0].innerText = target.value;
                    console.log('change span');
                    break;
                case 'bad':
                    range_val_ary[1].innerText = target.value;
                    break;
                case 'white':
                    range_val_ary[2].innerText = isopen(target.value);
                    break;
            }
            console.log('change sucess');
            // console.log(target.value);
            console.log(range_val_ary[0]);
            // console.log(target.nextElementSibling);

        } else if (target.getAttribute('name') === 'radio') {
            switch (target.getAttribute('id')) {
                case 'custom':
                    game_info[3] = '0';
                    console.log('custom');
                    break;
                case 'default':
                    game_info[3] = '1';
                    console.log('default');
                    break;
                default:
                    game_info[3] = '1';
                    console.log('we can find');
                    break;
            }
            console.log(game_info);
        } else {
            console.log('change fail');
        }
    }

    /*一開始預設設定*/
    function def() {
        //清空資料
        clearInfo();
        //存儲range 與 range_value  (ragge bar & ragne span)
        range_ary = document.querySelectorAll('.range');
        range_val_ary = document.querySelectorAll('.range-value');
        //找白板的range 與 span
        let range_ary_white = range_ary[range_ary.length - 1];
        let range_val_white = range_val_ary[range_val_ary.length - 1];
        //range.vaule抓進span
        range_ary.forEach(function (range, index) {
            range_val_ary[index].innerText = range.getAttribute('value');
        });

        /*處理白板開關*/
        switch (range_ary[range_ary.length - 1].value) {
            case '0':
                range_val_white.innerText = isopen(range_ary_white.value);
                break;
            case '1':
                range_val_white.innerText = isopen(range_ary_white.value);
                break;
        }

    }


    /*切換畫面處理*/
    function render(e) {
        e.preventDefault();
        let target = e.target;
        if (target.className = 'button') {
            switch (target.getAttribute('href')) {
                case '#previous':
                    target.nextElementSibling.setAttribute('href', pre_href);
                    page_container.innerHTML = page_previous_array.pop();
                    def();
                    // console.log(page_previous_array);
                    if (button_previous.nextElementSibling.getAttribute('href') === '#answer') {
                        button_group.firstElementChild.remove();
                    }
                    console.log(range_val_ary[0]);
                    console.log(game_info[0]);
                    console.log('previous');
                    break;
                case '#answer':
                    /*處理了button之後處理畫面render*/
                    /*view render將當前的畫面存到陣列裡，以便previous時回復*/
                    pre_href = target.getAttribute('href');
                    target.setAttribute('href', '#checkit');
                    button_group.insertBefore(button_previous, button_group.childNodes[0]);
                    page_previous = document.querySelector('.container').innerHTML;
                    page_previous_array.push(page_previous);
                    // console.log(page_previous_array[0]);
                    page_container.innerHTML = page_answer;
                    range_ary.forEach(function (ragne, index) {
                        game_info[index] = ragne.value;
                        console.log(game_info);
                    });
                    game_info[3] = '1';
                    decideSpy();
                    bad_remaining = game_info[1];
                    good_remaining = game_info[0] - game_info[1];
                    console.log(typeof player[0]);
                    console.log('answer');

                    break;
                case '#checkit':
                    pre_href = target.getAttribute('href');
                    target.setAttribute('href', '#checkit');
                    console.log(decideBadAnswer());
                    button_group.innerHTML = '';
                    button_group.appendChild(button_next);
                    // page_previous = document.querySelector('.container').innerHTML;
                    // page_previous_array.push(page_previous);
                    page_container.innerHTML = page_checkit2;
                    console.log('checkit');
                    showAll();
                    // console.log(game_info);
                    break;
                case '#next':
                    if (player_conunt < ((game_info[0] * 2) - 1)) {
                        player_conunt++;
                        console.log(player_conunt);
                        if (ischecked != true && count <= game_info[0]) {
                            ischecked = true;
                            showPlayer(count);
                            // page_container.insertBefore(p_ans, page_container.children[1]);
                            count++
                            console.log('checked');
                        } else {
                            ischecked = false;
                            page_container.removeChild(p_ans);
                            console.log('removeChild');
                        }
                    } else {
                        button_group.innerHTML = '';
                        page_container.innerHTML = page_gaming;
                        addPlayer();
                        console.log('game start');
                    }
                    break;
            }
        }
    }


    $(document).ready(function () {
        def();
        button_group.addEventListener('click', render, false);
        page_container.addEventListener('change', range_change, false);
        page_container.addEventListener('click', checkGameOver, false);
    });

    window.onbeforeunload = function(e) {
        let leave = '確定離開?資料將會遺失!';
        e.returnValue = leave;
        return leave;
    }
}
"use strict"

const TEST = {
    dataSet : new Object(),

    init : new function(){},
    gridSet : new function(){},
}

TEST.init = () => {
	console.log('gridInit');
    TEST.gridSet();
}

TEST.gridSet = () => {
    // 임시 테스트 데이터
    TEST.dataSet = [
        {
            'name' : '석봉',
            'year' : '1994',
            'date' : '0905',
            'region' : '부천',
        },
        {
            'name' : '시봉',
            'year' : '1994',
            'date' : '1231',
            'region' : '충주',
            'etc' : '바보임',
        }
    ];
}

// 실행
//$(function(){
window:onload = function(){
//	console.log('^^*');
    TEST.init();
}
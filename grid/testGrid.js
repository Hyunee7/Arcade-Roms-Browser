"use strict"

const TESTGRID = {
    init : new function(){},
    setGrid : new function(){},
    setColumsInfo : new function(){},

    testGrid : new Object(),
    columnsInfo : new Object(),
}

TESTGRID.init = async () => {
    await TESTGRID.setColumsInfo();             // 컬럼 준비
    await TESTGRID.setGrid();                   // 그리드 객체 생성
    TESTGRID.testGrid.resetData(TEST.dataSet);  // 그리드에 데이터 입력
}

/**
 * [그리드 객체 생성]
 * 그리드 객체를 생성한다.
 */
TESTGRID.setGrid = () => {
    const Grid = tui.Grid;

    TESTGRID.testGrid = new Grid({
        // Container element
        el: document.getElementById('testGrid'),
        bodyHeight: 250,        // Grid의 높이를 설정
        scrollX: true,          // scrollX : 가로 축 이동 추가여부
        rowHeaders: [
            // type : 'rowNum', 'checkbox'등이 있음  
            { type: 'rowNum', header: 'NO', },      // row 숫자 표시
            { type: 'checkbox', header: 'chk?'}     // 각 row 맨 앞에 체크박스 추가
        ],
        // 설정된 컬럼 지정
        columns: TESTGRID.columnsInfo,
    });
}

/**
 * [컬럼 설정]
 * 그리드에 표시될 컬럼을 작성한다.
 * 포멧만 맞춰 준다면 가변적으로도 만들 수 있다.
 */
TESTGRID.setColumsInfo = () => {
    TESTGRID.columnsInfo = [
        {
            header: '이름',
            name: 'name',
            align: "center",
            width: 100,
            sortable: true,
            ellipsis: true,
        },
        {
            header: '제조년도',
            name: 'year',
            align: "center",
            width: 80,
            sortable: true,
            ellipsis: true,
        },
        {
            header: '제조월일',
            name: 'date',
            align: "center",
            width: 80,
            sortable: true,
            ellipsis: true,
            // formatter를 이용하여 다양한 방식으로 출력이 가능하다.
            formatter: function(e){
                return `<a href="javascript:void(0)">${e.value.substring(0,2)} / ${e.value.substring(2,4)}</a>`; 
            },
        },
        {
            header: '지역',
            name: 'region',
            align: "center",
            width: 60,
            sortable: true,
            ellipsis: true,
        },
        {
            header: '특이사항',
            name: 'etc',
            align: "center",
            width: 120,
            sortable: true,
            ellipsis: true,
            // hidden 값을 주어 사용자에게 해당 컬럼을 숨길 수 있다.
            hidden: 1,
        },
    ]
}

// 실행
//$(function(){
//    TESTGRID.init();
//})

window:onload=function(){
    TESTGRID.init();
}
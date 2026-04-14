const initGrid = () => {
    // 그리드 객체
    const Grid = tui.Grid;

    /**
     * Grid 테마 커스텀
     * Grid.applyTheme('striped', {...}) : 
     * @param {String} default : 프리셋 (기본)
     * @param {String} striped : 프리셋 (줄무늬)
     * @param {String} clean : 프리셋 (클린)
     *      - preset theme name. Available values are 'default', 'striped' and 'clean'.
     *      - https://nhn.github.io/tui.grid/latest/Grid#applyTheme
     */
    Grid.applyTheme('defualt',  {
        cell: {
            normal: {
                border: 'black'
            },
            header: {
                background: 'gray',
                text: 'white'
            },
            evenRow: {
                background: '#fee'
            }
        }
    });

    /**
     * 그리드 설정
     * @variable {Dom} el : 그리드 element(DOM)
     * @variable {boolean} scrollX : X 스크롤 사용여부
     * @variable {boolean} scrollY : Y 스크롤 사용여부
     * @variable {boolean} draggable : 드레그 사용 여부
     * @variable {Object} header
     *      - @variable {Number} height : 헤더 높이
     * @variable {Number} bodyHeight : 그리드 바디 높이
     * @variable {*} contextMenu : 마우스 우클릭 옵션
     * @variable {Array} columns :
     *      - @variable {String} header : 컬럼명(헤더)
     *      - @variable {String} name : 컬럼 name (input data와 이름이 일치해야함)
     *      - @variable {String} align : 정렬
     *      - @variable {Number} width : 너비
     *      - @variable {String} whiteSpace : 줄바꿈 설정
     *      - @variable {Function} formatter : 출력 포멧
     * 기타 옵션은 공식 document를 참조하자.
     */
    
    const sampleGrid = new Grid({
        el: document.getElementById('gmelistGridDiv'),
        scrollX: false,
        scrollY: false,
        draggable: false,
        header: { height: 30 },
		rowHeaders: [{
                    type: 'rowNum',
                    header: "-",
                    width: 10,
                }],
        //bodyHeight: 200,
		rowHeight: 'auto',
        contextMenu: null,
        columns: [
            {
                header: 'Game',
                name: 'image',
                align: "center",
                width: 150,
				height: 150,
				whiteSpace: 'normal',
                formatter: function (e) {
                //    return e.value
					return '<img src="'+e.value+'">';
                },
                //formatter: function (e) {
                //    return e.value
                //},
				//renderer: {
				//	type: CellRenderer
				//}
            }
        ]
    });

    return sampleGrid;
}

class CellRenderer {
	constructor(props) {
		var el = document.createElement('image');
		el.className = 'gamelist';
		console.log(props.value)
		//el.src = props.value;
		el.src = String(props.value);
		var tmp = new Image();
		tmp.src = String(props.value);
		el.src = tmp.src;
		this.el = el;
		console.log(el);
		this.render(props);
	}
	getElement() {
		return this.el;
	}
	render(props) {
		//console.log(props.value)
		this.el.src = String(props.value);
	}
}
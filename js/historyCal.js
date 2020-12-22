
// 나중에 포맷과 타입을 분리하여 표시할거임
var historyCal = function(format, type, start, end, distance, perSecond) {
	var option = {
		"format": format,	// 얘도 일단 무시
		"type": type,	// 무시
		"start": start,
		"end": end,
		"distance": distance,	// 일단 얘는 무시하자
		"perSecond": perSecond,
	};
	
	var now = {
		"Y": 1996,	// 연도
		"M": 1,	// 월
		"D": 20,	// 일
		"W": 0,		// 요일 (일요일이 0번, 월요일이 1번이고 토요일이 6임)
		"L": false,	// 윤년 여부 (true는 윤년이고, false는 평년임)
	};
	
	// 나중에 이거 안에 포맷에 따라 표시되는 요일이 달라지도록 할 것임
	var dayOfTheWeeks = [
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	];
	
	var months = [
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	];
	
	var shortMonth = [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	
	// 이번 해가 윤년인가? 윤년(true)이면 2월에는 29일까지 있고, 평년(false)은 28일까지 있다.
	var flagLeapMonth = false;
	
	// 이번 달에는 몇일까지 있을까? 아, 여기서 요일을 제외한 모든 숫자는 0부터 시작하지 않는다.
	var monthLength = 30;
	
	this.start = function() {
		
		var DOTW = this.getDayOfTheWeek();
		
		now.Y = start.year;
		now.M = start.month;
		now.D = start.day;
		now.W = DOTW;
		
//		setInterval(this.hcShow, option.perSecond);
	}
	
	this.hcShow = function() {
		
	}
	
	// Set Date
	this.setYear = function(year) {
		now.Y = year;
	};
	this.setMonth = function(month) {
		now.M = month;
	};
	this.setDay = function(day) {
		now.D = day;
	};
	this.setDOTW = function(dayOfTheWeek) {
		now.W = dayOfTheWeek;
	};
	this.setDate = function(year, month, day, dayOfTheWeek) {
		this.setYear(year);
		this.setMonth(month);
		this.setDay(day);
		this.setDOTW(dayOfTheWeek);
	};
	
	// Get Date
	this.getYear = function() {
		return now.Y;
	};
	this.getMonth = function() {
		return now.M;
	};
	this.getDay = function() {
		return now.D;
	};
	this.getDOTW = function() {
		return now.W;
	};
	this.getDate = function() {
		return {
			"year": this.getYear(),
			"month": this.getMonth(),
			"day": this.getDay(),
			"dayOfTheWeek": dayOfTheWeeks[this.getDOTW()],
		};
	};
	
	// PREVIOUS & NEXT Methods
	this.previous = function() {
		
	}
	this.next = function() {
		
	}
	
	this.prevYear = function() {	// 연도를 증가시키거나 감소시킨다.
		now.Y--;
		flagLeapMonth = this.isLeapYear(now.Y);
	}
	this.nextYear = function() {
		now.Y++;
		flagLeapMonth = this.isLeapYear(now.Y);
	}
	
	this.prevMonth = function() {	// 1월부터 12월까지 있는 가운데 이 범위를 넘으면 연도가 증가하거나 감소한다.
		if (now.M == 1) {
			this.prevYear();
			now.M = 12;
		}
		else {
			now.M--;
		}
		
		monthLength = this.getDayLength(now.M);
	}
	this.nextMonth = function() {
		if (now.M == 12) {
			this.nextYear();
			now.M = 1;
		}
		else {
			now.M++;
		}
		
		monthLength = this.getDayLength(now.M);
	}
	
	this.prevDay = function() {	// 여기서 day가 month의 범위를 넘어설 때, Month가 증가하거나 감소한다.
		if (now.D == 1) {
			this.prevMonth();
			now.D = this.getDayLength(now.M);
		}
		
		this.prevDOTW();
	}
	this.nextDay = function() {
		if (now.D == monthLength) {
			this.nextMonth();
			now.D = 1;
		}
		else {
			now.D++;
		}
		
		this.nextDOTW();
	}
	
	this.prevDOTW = function() {
//		if (now.W == 0) now.W = 6;
//		else now.W--;
		now.W = ((now.W == 0) ? 6 : now.W-1);
	}
	this.nextDOTW = function() {
//		if (now.W == 6) now.W = 0;
//		else now.W++;
		now.W = ((now.W == 6) ? 0 : now.W+1);
	}
	
	
	this.isLeapYear = function(year) {
		// 여기서 4로 나누어 떨어지고, 400으로 나누어 떨어지지 않으며, 100으로 나누어 떨어지는 그 해는 윤년이다.
		return ((year % 4 == 0) ? (((year % 400 != 0) && (year % 100 == 0)) ? false : true) : false);
	};
	
	// 이 함수는 둠스데이 알고리즘을 바탕으로 설계된 것이며, 맨 처음 시작할 때의 연도와 월, 일을 바탕으로 요일을 구한다.
	// 지금부터 이 함수는 두개로 다음과 같이 나눈다.
	// 먼저 그 해의 첫 날의 요일을 반환하는 함수와 그 요일을 기준으로 원하는 날의 요일을 구하는 함수를 만든다.
	this.getDayOfTheWeek = function(year, month, day) {
		// 여기서 2월의 둠스데이는 평년일 때 28일, 윤년일 때 29일이다. 그래서 2월이 생략되었다.
		// 또한 1월도 마찬가지인데 평년일 경우 3일, 윤년일 경우 4일이 둠스데이가 된다.
		// 예를 들어 어느 해의 4월 4일이 금요일이면 6월 6일, 9월 5일도 금요일이 되는 것이다.
		// 그럼 그 해의 12월 25일은? 둠스데이에서 12월 12일이 금요일이므로 12+(2*7)-1 = 25일이므로 목요일이 된다.
		// 그 해의 7월 2일은 둠스데이에 의해 7월 11일이 금요일이므로 2 = 11-(7*1)-2로 계산하면 수요일이 된다.
		
		// 해가 바뀌는 경우에는 1년이 지날 때마다 1일씩 달라진다. (365 / 7 = 364 + 1 = (7*52) + 1)
		// 여기서 4로 나누어 떨어지고, 400으로 나누어 떨어지지 않으며, 100으로 나누어 떨어지는 그 해는 윤년이다.
		// 윤년은 365일이 아닌 366일이므로 1일이 아닌 2일이나 달라지게 된다.
		
		// 둠스데이에서 요일이 항상 같은 월과 일의 리스트 (7을 중심으로 순환하기 때문임)
		var doomsdays = {
			4: 4, 6: 6, 8: 8, 10: 10, 12: 12, 9: 5, 5: 9, 7: 11, 11: 7, 3: 7
		};
		// 위와 같이 동일한 요일을 묶는다면 평년일 때 2월은 28일, 윤년은 29일이며, 평년일 때 1월은 3일, 윤년은 4일임.
		
		// 둠스데이 알고리즘을 통해 연도에 따라 시작하는 요일을 계산
		
		var isLeapYear = this.isLeapYear(year);	// 
		
		var dotw = 0;	// 0은 일요일임
		var doomsday = doomsdays[month];
		
		// 1월과 2월을 계산할 경우
		if (month == 1 && month == 2) {
			// 윤년일 경우
			if (this.isLeapYear(year)) dotw += 2;
			else dotw += 1;
		}
		
		// 3월부터 12월까지를 계산하는 경우
		if (month >= 3 && month <= 12) dotw += 1;
	}
	// 이 함수는 그 해의 첫번째 요일을 구하는 함수다. 여기서 1월 1일 기준임
	this.getFirstDayOfTheYear = function(year) {
		// 연도에 따라 요일이 달라지는 것을 계산함 (100으로 나누어 떨어지는 해를 표시하여 패턴을 분석해 보면 된다.)
		var yearsToDooms = {
			0: [1599, 1700,       1897, 1999, 2100,       2297, 2399, 2500],	// Sunday
			1: [      1701, 1796, 1898,       2101, 2196, 2298,       2501],	// Monday
			2: [1600, 1702, 1797, 1899,       2102, 2197, 2299, 2400, 2502],	// Tuesday
			3: [1601, 1703, 1798, 1900, 2000, 2103, 2198, 2300, 2401, 2503],	// Wednesday
			4: [1602,       1799, 1901, 2001,       2199, 2301, 2402      ],	// Thursday
			5: [      1704, 1800, 1902, 2002, 2104, 2200, 2302, 2403, 2504],	// Friday
			6: [      1705, 1801, 1903, 2003, 2105, 2201, 2303,       2505],	// Saturday
		};
		// 이거 참조를 절대 하지마시오 - 연도와 실제 시작 요일과 상관없음.
		
		// 아래처럼 20년 또는 50년, 100년 단위로 기준점을 만들여야 할 것이다.
		// 1920년 1월 1일 목요일 - 4
		// 1940년 1월 1일 월요일 - 1
		// 1980년 1월 1일 화요일 - 2
		// 2000년 1월 1일 토요일 - 6
	}
	// 아래의 사용방법은 다음과 같다. 기준점이 무슨 요일이라면 그 기준점에서 해당 연도까지 연도 갯수로 계산한다.
	// 예를 들어 2000년 첫번째 요일이 4이라면 2012년을 구할 때 2012 - 2000 + (그동안의 윤년 갯수)를 구한다.
	// 위 계산에 4를 더한다. 7을 넘는다면 %를 써서 나머지를 도출하면 그 해의 1월 1일의 요일이 나오게 될 것이다.
	
	// 그 다음, 해당년도의 1월 1일의 요일을 알게 되었으니 1월 1일에서 6월 23일까지 계산해야 한다.
	// 방법은 위의 둠스데이 알고리즘을 이용하는 것이다. 
	// 평년이면 2 더하고, 윤년이면 3을 더한다. 그 다음, 알아내려는 월의 같은 일자를 알아낸다.
	// 6월이 6일과 같다. 그러면 23일까지이므로 (23-6)%7의 값이 바로 구하려는 일자의 요일이 된다!
	
	// 생각해보니까 1920년(1월 1일)에서 1926년 1월 1일의 요일을 구하는 것이므로 아래에서 endYear는 계산하지 않는다.
	
	// 혹시 몰라서 넣어본거 - startYear부터 endYear-1까지 연도 중에서 윤년이 모두 몇개인지 계산하는 함수
	this.getNumOfLeapYear = function(startYear, endYear) {
		var leapYears = 0;
		
		// 그러므로 연도를 증가하면서 윤년인지 판별하여 갯수를 반환하도록 한다.
		for (var year = startYear; year < endYear; year++) {
			if (this.isLeapYear(year)) leapYears++;
		}
		
		return leapYears;
	};
	
	this.getDayLength = function(month) {
		// 31 : 1, 3, 5, 7, 8, 10, 12
		// 30 : 4, 6, 9, 11
		// leap : 2
		return (
			(month>7)?(
				(month%2==0)?31:30
			):(
				(month==2)?(
					this.isLeapYear(now.Y)?29:28
				):(
					(month%2==0)?30:31
				)
			)
		);	// 7과 8을 분기점으로 계산
	};
	
	
};


var start = {
	"year": 1901,
	"month": 4,
	"day": 29
};
var end = {
	"year": 1989,
	"month": 1,
	"day": 7
};

// format(맨앞)에서 0은 'YYYY/MM/DD', 1은 'MM/DD/YYYY', 2: 'DD/MM/YYYY', 3: 
// type(앞에서 2번째)에서 0은 day와 함께 day를 표시, 1은 day, 2는 month, 3은 year이다.
var hc = new historyCal(1, 1, start, end, 1);	// 여기서 distane는 무조건 type에 따라 바뀐다. 예를 들어 day로 설정하면 day 간격만큼의 숫자가 계산된다.

var count = 1901;

function hcStart() {
	setInterval(hcShow, 400);
}

function hcShow() {
//	count++;
	hc.nextDay();
	
	var today = hc.getDate();
	var time = today.year + '년 ' + today.month + '월 ' + today.day + '일 ' + today.dayOfTheWeek;
	document.getElementById('hc-time').innerHTML = time;
	// 그러고 보니까 멈추는게 없네??
}


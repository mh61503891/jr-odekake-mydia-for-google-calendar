$('td.train_name').find('br').after($('<a>', {
	class: 'add_event_to_google_calender',
	target: '_blank',
	html: $('<img>', {
		src: 'https://developers.google.com/chrome/web-store/images/imageAssets/calendar.png',
		width: 18,
		height: 18,
		alt: 'Googleカレンダーに追加'
	})
}))

$(document).delegate('.add_event_to_google_calender', 'mouseenter', function() {
	var dot_line = $(this).parent().parent()
	var prev_station = dot_line.prev()
	var next_station = dot_line.next()
	var data = {
		train_name: dot_line.find('.train_name').html().split('<br>').shift(),
		prev: {
			time: (typeof prev_station.find('.time') === 'undefined' ? prev_station.find('.time').html().split('<br>').pop() : prev_station.find(':first-child').html().split('<br>').pop()),
			station_name: prev_station.find('.station_name').text()
		},
		next: {
			time: next_station.find('.time').html().split('<br>').shift(),
			station_name: next_station.find('.station_name').text()
		}
	}
	$(this).attr('href', url_for(data))
})


// TODO 出発日が2日以上の後の場合
// TODO 1区間が2日以上またぐ場合
function url_for(data) {
	var departure_date = moment($('p#txt_result span.txtBold').text() + '+0900', 'YYYYMMDDHH:mmZ')
	var prev_date = moment(departure_date.format('YYYYMMDD') + data.prev.time + '+0900', 'YYYYMMDDHH:mmZ')
	var next_date = moment(departure_date.format('YYYYMMDD') + data.next.time + '+0900', 'YYYYMMDDHH:mmZ')
	// 出発時間が翌日
	if (departure_date.format('HH:mm') > prev_date.format('HH:mm')) {
		prev_date.add('days', 1)
		next_date.add('days', 1)
	}
	// 出発から到着までに日をまたぐ場合
	if (prev_date.format('HH:mm') > next_date.format('HH:mm')) {
		next_date.set('day', prev_date.day() + 1)
	}
	var param = {
		action: 'TEMPLATE',
		text: data.prev.station_name + '->' + data.next.station_name + ':' + data.train_name,
		dates: prev_date.utc().format('YYYYMMDDTHHmmss') + 'Z' + '/' + next_date.utc().format('YYYYMMDDTHHmmss') + 'Z',
		details: '',
	}
	var url = 'http://www.google.com/calendar/event?' + $.param(param)
	return url
}
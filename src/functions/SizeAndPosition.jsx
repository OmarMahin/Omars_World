export function decideSizeAndPos(width, getSize, getCameraDis, getLetterPos, coord_L, coord_O) {
    let _w, _h, _cameraDis, _l_x, _l_y, _o_x, _o_y;

    if (width >= 1024) {
        _w = window.innerWidth;
        _h = 700;
        _cameraDis = 22;
        if (coord_L && coord_O) {
            _l_x = coord_L.x + coord_L.height / 5;
            _l_y = coord_L.y - coord_L.height / 1.35;

            _o_x = coord_O.x + coord_O.width / 2;
            _o_y = coord_O.y + coord_O.height / 1.4;
        }
    } else if (window.innerWidth >= 768) {
        _w = window.innerWidth;
        _h = 526;
        _cameraDis = 21;
        if (coord_L && coord_O) {
            _l_x = coord_L.x + coord_L.height * 1.2;
            _l_y = coord_L.y - coord_L.height * 1.5;

            _o_x = coord_O.x + coord_O.width / 2;
            _o_y = coord_O.y + coord_O.height / 1.4;
        }
    } else if (window.innerWidth >= 640) {
        _w = window.innerWidth;
        _h = 438;
        _cameraDis = 20;
        if (coord_L && coord_O) {
            _l_x = coord_L.x + coord_L.height * 1.2;
            _l_y = coord_L.y - coord_L.height * 1.5;

            _o_x = coord_O.x + coord_O.width / 2;
            _o_y = coord_O.y + coord_O.height / 1.4;
        }
    } else if (window.innerWidth >= 320) {
        _w = window.innerWidth;
        _h = window.innerHeight;
        _cameraDis = 24;
        if (coord_L && coord_O) {
            _l_x = coord_L.x + coord_L.height * 0.6;
            _l_y = coord_L.y - coord_L.height * 1.5;

            _o_x = coord_O.x + coord_O.width / 2;
            _o_y = coord_O.y + coord_O.height / 1.4;
        }
    }

    if (getSize){
        return [_w, _h]
    }
    else if (getCameraDis){
        return _cameraDis
    }
    else if (getLetterPos){
        return [_l_x, _l_y, _o_x, _o_y]
    }
}
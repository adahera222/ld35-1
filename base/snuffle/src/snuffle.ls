init-program = ->
  document.get-element-by-id(\program).value =
    window.location.hash?.substr(1) or 'ffr.ffr.ffr.ffr.'

get-program = ->
  document.get-element-by-id(\program).value

FPS = 30
RES = 30

DIRS = # 0 is up
  0: {x: 0, y: -1, deg: 0}
  90: {x: 1, y: 0, deg: 90}
  180: {x: 0, y: 1, deg: 180}
  270: {x: -1, y: 0, deg: 270}

draw-circle = (color, start, radius, ctx) ->
  ctx.begin-path!
  ctx.arc start.x, start.y, radius, 0, 2 * Math.PI
  ctx.close-path!
  ctx.fill-style = color
  ctx.fill!

draw-triangle = (color, start, height, ctx) ->
  ctx.fill-style = color
  ctx.move-to start.x, start.y
  ctx.begin-path!
  ctx.line-to start.x + (height/2), start.y + height
  ctx.line-to start.x - (height/2), start.y + height
  ctx.line-to start.x, start.y
  ctx.close-path!
  ctx.fill!

R = -> ~~(it * Math.random!)

pick = -> it[R(it.length)]

random-color = ->
    palette = \0123456789ABCDEF
    \# + (pick palette) + (pick palette) + (pick palette)

# This is a state machine
class Behavior
  (@method, @tape=null) ->
    @pointer = 0

  perform: (target) ~>
    return null if @pointer > @tape.length
    target[@method] @tape[@pointer]
    @pointer++

class Snuffle
  (@nose, @band, @body, @x=0, @y=0, @height=RES) ->
    @speed = 2
    @rotation = 0
    @step = @height

  center: ~>
    h2 = ~~(@height/2)
    x: @x, y: @y + h2

  tick: ~>
    @x += ~~@vx * @speed
    @y += ~~@vy * @speed
    @rotation += ~~@va %% 360


  draw: (ctx) ~>
    ctx.save!
    cc = {x: 0, y: 0}
    if @rotation
      cc = @center!
      ctx.translate cc.x, cc.y
      ctx.rotate (Math.PI / 180) * @rotation
    draw-triangle @body, {x: @x - cc.x, y: @y - cc.y}, @height, ctx
    draw-triangle @band, {x: @x - cc.x, y: @y - cc.y}, 0.4 * @height, ctx
    draw-triangle @nose, {x: @x - cc.x, y: @y - cc.y}, 0.3 * @height, ctx
    ctx.restore!

  stop: ~> @vx = 0; @vy = 0; @va = 0

  orientation: (rotation = @rotation) ~>
    ind = ~~((rotation + 44) / 90) %% 4
    console.log "rotation: #rotation :: ind: #ind"
    DIRS[ind*90]

  move: (dir) ->
    ori = @orientation!
    @stop!
    switch dir
    #| \f => @x += @step * DIRS[@rotation].x; @y += @step * DIRS[@rotation].y
    #| \b => @x -= @step * DIRS[@rotation].x; @y -= @step * DIRS[@rotation].y
    | \f => @vx = ori.x; @vy = ori.y
    | \b => @vx = -ori.x; @vy = -ori.y
    | \p => ori = @orientation(@rotation + 270); @vx = ori.x; @vy = ori.y
    | \s => ori = @orientation(@rotation +  90); @vx = ori.x; @vy = ori.y
    #| \r => @rotation = (@rotation + 90) %  360; @stop!
    #| \l => @rotation = (@rotation - 90) %% 360; @stop!
    | \r => @va =  90 / (FPS/2)
    | \l => @va = -90 / (FPS/2)
    | \U => @rotation = 0
    | \R => @rotation = 90
    | \D => @rotation = 180
    | \L => @rotation = 270
    | otherwise => \nothing

class Blok
  (@hour, @decade, @instant, @x=0, @y=0, @height=RES) ->

  center: ~>
    h2 = ~~(@height/2)
    x: @x + h2, y: @y + h2

  pos:
    x: @x, y: @y

  draw: (ctx) ->
    ctx.save!
    ctx.fill-style = @decade
    ctx.fill-rect @x, @y, @height, @height
    #@draw-corners ctx
    h2 = ~~(@height / 2)
    @draw-triangle @hour, @center!, {x: h2, y: h2}, {x: -h2, y: h2}, ctx
    @draw-triangle @hour, @center!, {x: h2, y: -h2}, {x: -h2, y: -h2}, ctx
    if @instant
      h4 = ~~(@height/4)
      # Alternative circle fill
      #draw-circle @instant, @center!, h4, ctx
      ctx.fill-style = @instant
      ctx.fill-rect @x + h4, @y + h4, 2 * h4, 2 * h4
    ctx.restore!

  draw-corners: (ctx) ->
    h4 = ~~(@height / 4)
    h2 = ~~(@height / 2)
    @draw-triangle @hour, {x: @x, y: @y}, {x: h4, y: 0}, {x: 0, y: h2}
    @draw-triangle @hour, {x: @x + @height, y: @y}, {x: -h4, y: 0}, {x: 0, y: h2}
    @draw-triangle @hour, {x: @x, y: @y + @height}, {x: h4, y: 0}, {x: 0, y: -h2}
    @draw-triangle @hour, {x: @x + @height, y: @y + @height}, {x: -h4, y: 0}, {x: 0, y: -h2}

  draw-triangle: (fill, start, diff1, diff2, ctx) ->
    ctx.move-to start.x, start.y
    ctx.begin-path!
    ctx.line-to start.x + diff1.x, start.y + diff1.y
    ctx.line-to start.x + diff2.x, start.y + diff2.y
    ctx.line-to start.x, start.y
    ctx.close-path!
    ctx.fill-style = fill
    ctx.fill!

make-snuffles = ->
  for x from 0 til 18
    snuff = new Snuffle random-color!, random-color!, random-color!, (RES * (2+x)) - (RES/2), 10 * RES
    snuff.behavior = new Behavior \move, get-program!
    snuff.rotation = 90 * R(4)
    snuff.rotation = 0
    snuff

make-wall = ->
  colors = [\#aca \#bdb \#beb \#ada \#cec \#cfc]
  center-colors = [\#ccc \#cfc]
  for x from 0 til 400
    blok = new Blok pick(colors), pick(colors), pick(center-colors), ~~(x/20)*RES, ~~(x%20)*RES

# Get started
canvas = document.get-element-by-id \canvas
ctx = canvas.get-context \2d

window.snuffles = make-snuffles!
window.wall = make-wall!

start = ->
  window.snuffles = make-snuffles!
  window.wall = make-wall!

ENTER = 13; SPACE = 32
document.onkeypress = (ev) ->
  console.log ev
  switch ev.which
  #| SPACE => window.stop = !window.stop
  | ENTER => start!
  | otherwise => \nothing

window.frame = 0

draw-frame = ->
  return if window.stop
  ctx.clearRect 0 0 800 600
  for blok in window.wall
    blok.draw ctx
  for snuff in window.snuffles
    snuff.tick!
    snuff.behavior.perform snuff if window.frame % (FPS/2) == 0
    snuff.draw ctx
  window.frame++

set-interval draw-frame, 1000/FPS
window.stop = false
init-program!
start!

## GLOBALS
{map, filter, flatten} = require 'prelude-ls'
Key = Mousetrap

const FPS = 30
const RES = 40
const DIRS = [
        [\vy -1 \up]
        [\vx 1 \right]
        [\vy 1 \down]
        [\vx -1 \left]
]
# Remove an element from a list (mutates)
remove = (list, member) ->
  ii = list.index-of member
  if -1 < ii
    list.splice ii, 1

deg-to-rad = -> it * (Math.PI / 180)

## CLASSES

class Point
  (@x, @y) ~>

  angle: (oo) ~>
    dy = oo.y - @y
    dx = oo.x - @x
    Math.atan2 dy, dx

  dist: (oo) ~>
    Math.sqrt  ((@x - oo.x) ^ 2) + ((@y - oo.y) ^ 2)

  midpoint: (oo, percent=0.5) ~>
    ang = @angle oo
    factor = percent * @dist oo
    dx = factor * Math.cos ang
    dy = factor * Math.sin ang
    new Point @x + dx, @y + dy

  clamped: ~>
    new Point ~~@x, ~~@y

class Stage
  ->
    @canvas = document.get-element-by-id \canvas
    @ctx = @canvas.get-context \2d
    @ctx.moz-image-smoothing-enabled = false
    @ctx.webkit-image-smoothing-enabled = false
    @children = []

  clear: ->
    @ctx.clear-rect 0, 0, @canvas.width, @canvas.height

  draw-label: (x, y, text) ->
    @ctx.font = '16pt Arial'
    @ctx.fill-style = \white
    @ctx.fill-text text, x, y

  add: (c) -> @children.push c

  remove: (c) ->
    remove @children, c

  draw: ->
    @clear!
    map (~> it.draw @ctx), @children

class Layer
  ->
    @children = []

  draw: (ctx) ~>
    #TODO consider sorting on z-index
    map (.draw ctx), @children

  add: (c) ~> @children.push c

  remove: (c) ~>
    remove @children, c

  clear: ~> @children = []

  set: ~> @children = [it]

Centerable =
  center: -> Point (@x + (@width / 2)), (@y + (@height / 2))
  move-center-to: (point) ->
    @x = point.x - (@width/2)
    @y = point.y - (@height/2)

class Character implements Centerable
  @all = []
  @tagged = (tag) ->
    @all.filter (x) -> tag in x.tags
  @empty-all = -> @all = []

  (@x, @y, @size=RES, drawable) ->
    @@all.push this
    @tags = []
    @visible = true
    @ticks = []
    @add-tick @physics2D
    @graphics = drawable or Snuffle \#aaa, \#999, \#666

    @width = @height = @size
    @vx = 0; @vy = 0; @last-pos = Point 0, 0
    @last-dir = DIRS.0

  physics2D: ->
    @x += @vx
    @x -= @vx if @vx and is-in-wall this
    @y += @vy
    @y -= @vy if @vy and is-in-wall this
    @last-pos = Point @x, @y

  exit: ~> remove @@all, this

  draw: (ctx) ->
    return unless @visible
    ctx.save!
    cx = @x; cy = @y
    if @alpha
      ctx.global-alpha = @alpha
    if @rotation
      ctx.translate (@x + (@width / 2)), (@y + (@height / 2))
      ctx.rotate (Math.PI / 180) * @rotation
      @x = -(@width / 2)
      @y = -(@height / 2)
    @graphics.draw ctx, (Point @x, @y)
    ctx.restore!
    @x = cx; @y = cy

  tick: -> # Execute functions from a list for flexibility
    for tt in @ticks
       if \remove-me == tt.call this
         @remove-tick tt

  add-tick: (f) ->
    @ticks.push f

  remove-tick: (f) ->
    remove @ticks, f

  intersect: (oo) ~>
    return unless oo
    @x <= oo.x + oo.width and
    oo.x <= @x + @width and
    @y <= oo.y + oo.height and
    oo.y <= @y + @height

  dist: (oo) ->
    mc = x: @x + (@width / 2), y: @y + (@height / 2)
    oc = x: oo.x + (oo.width / 2), y: oo.y + (oo.height / 2)
    Math.sqrt ((mc.x - oc.x) ^ 2) + ((mc.y - oc.y) ^ 2)

draw-arc = (color, start, radius, ctx, rads) ->
  ctx.begin-path!
  ctx.arc start.x, start.y, radius, Math.PI, Math.PI + rads
  ctx.close-path!
  ctx.fill-style = color
  ctx.fill!

draw-circle = (color, start, radius, ctx) ->
  draw-arc color, start, radius, ctx, 2 * Math.PI

draw-semicircle = (color, start, radius, ctx) ->
  draw-arc color, start, radius, ctx, Math.PI

draw-triangle = (color, start, height, ctx, width) ->
  width = height unless width
  ctx.fill-style = color
  ctx.move-to start.x, start.y
  ctx.begin-path!
  ctx.line-to start.x + (width/2), start.y + height
  ctx.line-to start.x - (width/2), start.y + height
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
  (@nose, @band, @body, @height=RES) ~>

  draw: (ctx, pos) ~>
    pos = Point pos.x + @height/2, pos.y
    draw-triangle @body, pos, @height, ctx
    draw-triangle @band, pos, 0.4 * @height, ctx
    draw-triangle @nose, pos, 0.3 * @height, ctx

class Shrine
  (@moon, @wedge, @size = 4*RES) ~>

  draw: (ctx, pos) ~>
    pos = Point pos.x + @size/2, pos.y
    draw-semicircle @moon, pos, @size/2, ctx
    draw-triangle @wedge, pos, -@size/2, ctx, @size

class Blok
  (@hour, @decade, @instant, @x=0, @y=0, @height=RES) ->
    @width = @height

  center: ~>
    h2 = ~~(@height/2)
    x: @x + h2, y: @y + h2

  pos:
    Point @x, @y

  draw: (ctx) ~>
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
      draw-circle @instant, @center!, h4, ctx
      #ctx.fill-style = @instant
      #ctx.fill-rect @x + h4, @y + h4, 2 * h4, 2 * h4
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

make-wall = ->
  colors = [\#aca \#bdb \#beb \#ada \#cec \#cfc]
  center-colors = [\#ccc \#cfc]
  for x from 0 til 20
    for y from 0 til 15
      blok = new Blok pick(colors), pick(colors), pick(center-colors), x*RES, y*RES

# This shouldn't be global but where to put it is unclear
# TODO slow, make it smarter
is-in-wall = (oo) ->
  # The character can be in up to four cells
  # For each cell, get the block
  walls = window.game.world.bg.children.0.walls
  collisions = filter (oo.intersect), walls
  return true if collisions.length > 0

class Map
  (@mapping) ~>
    # Mapping is a 2d array of [color color color solid?]
    colors = [\#aca \#bdb \#beb \#ada \#cec \#cfc]
    center-colors = [\#ccc \#cfc]
    m = @mapping

    @cells = for x from 0 til 20
      for y from 0 til 15
        m = @mapping[x][y]
        blok = new Blok m.0, m.1, m.2, x*RES, y*RES
        blok.solid = m.3
        blok
    @walls = filter (.solid is true), flatten @cells

  draw: (ctx) ~>
    map (.draw ctx), flatten @cells

class FlowerStack
  (size = RES*2) ~>
    @flowers = [
      (Flower.random size),
      (Flower.random ~~(size * 0.8)),
      (Flower.random ~~(size * 0.5))
    ]
    console.log @flowers

  draw: (ctx, pos) ~>
    map (.draw ctx, pos), @flowers

class Flower
  @colors = [\black \red \green \blue \purple \orange \white \cyan]
  @random = (size=RES) ~>
    color = pick @colors
    petals = 3 * (R(8) + 1)
    s4 = ~~(size/4)
    cp1 = Point R(size/3), R(size/4) + s4
    cp2 = Point size - R(size/2), R(size/4) + s4
    Flower color, petals, cp1, cp2, size

  (@color, @petals, @cp1, @cp2, @size=RES) ~>
    @opacity = 0.3

  itos: (val, frac=1) ~> # Get value in terms of size
    val * (@size/frac)

  draw: (ctx, pos) ~>
    ctx.save!
    ctx.global-alpha = @opacity
    ctx.fill-style = @color
    ctx.translate pos.x, pos.y
    ctx.move-to 0, 0
    for p from 0 til @petals
      ctx.begin-path!
      ctx.bezier-curve-to @cp1.x, @cp1.y, @cp2.x, @cp2.y, @size, 0
      ctx.bezier-curve-to @cp2.x, -@cp2.y, @cp1.x, -@cp1.y, 0, 0
      ctx.close-path!
      ctx.fill!
      ctx.rotate deg-to-rad (360 / @petals)
    ctx.restore!

class Room
  (width=20, height=15) ~>
    solid = [\black \black \white true]
    empty = [\#eee \#ddd \#ddd false]
    @mapping =
      for x from 0 til width
        for y from 0 til height
          empty

    #TODO place flower
    flower-spots = [
      Point RES * 5, RES * 5
      Point RES * 5, RES * 10
      Point RES * 10, RES * 7
      Point RES * 15, RES * 5
      Point RES * 15, RES * 10
    ]

    fpos = pick flower-spots

    @flower = new Character fpos.x, fpos.y, RES, new FlowerStack
    #TODO place creature
    #TODO place obstacles

class Game
  (@width, @height, @fps) ->
    @frame = 0
    @pause = false
    @over  = false
    @world = new Stage

    @world.add new Layer
    @world.add new Layer
    @world.add new Layer
    @world.bg = @world.children.0     # walls, the ground itself
    @world.ground = @world.children.1 # flowers and things on the ground
    @world.fg = @world.children.2     # where characters go

    Key.bind \space -> @pause = !@pause

    Key.bind \a ~>
      s = new Character 10 * RES, 10 * RES, 4 * RES, (Shrine \#39f, \#cc6)
      @world.ground.add s

    Key.bind \z ~>
      f = new Character @player.x, @player.y, 4 * RES, new FlowerStack
      @world.ground.add f

    #TODO add an intro screen
    @loop-instance = set-interval @loop, 1000 / @fps

    @player = new Character 3* RES, 3* RES, RES, (Snuffle \#aaa, \#000, \#aaa)
    # bind movement
    for let dd in DIRS
      Key.bind dd.2, ~> @player[dd.0] = 6 * dd.1
      Key.bind dd.2, (~> @player[dd.0] = 0), \keyup

    solid = [\black \black \white true]
    empty = [\#eee \#ddd \#ddd false]
    mapping = [ [solid] * 15].concat ([[empty] * 15] * 18) .concat [[solid] * 15]

    @world.bg.add Map mapping
    @world.fg.add @player

    mapping = [ [solid] * 15].concat ([[empty] * 15] * 18) .concat [[solid] * 15]
    mapping2 = [ [solid] * 15].concat ([[empty] * 15] * 17) .concat [[solid] * 15] * 2
    mapping3 = [ [solid] * 15].concat ([[empty] * 15] * 16) .concat [[solid] * 15] * 3
    @world-map = [[mapping, mapping2, mapping3]]
    @screen = Point 0, 0

  screen-swap: ~>
    if @player.y < 0
      @screen = Point @screen.x, @screen.y - 1
      @world.bg.set Map @world-map[@screen.x][@screen.y]
      @player.y = @height - @player.height - 1
    if @player.y + @player.height > @height
      @screen = Point @screen.x, @screen.y + 1
      @world.bg.set Map @world-map[@screen.x][@screen.y]
      @player.y =  1

  loop: ~>
    return if @pause
    @frame++
    for cc in Character.all
      cc?.tick!
    #TODO check for screen switch
    @screen-swap!
    @world.draw!
    if @over
      @world.draw-label 300 230 "GAME OVER"
      @world.draw-label 260 260 "push r to restart"

window.game = new Game 800, 600, FPS


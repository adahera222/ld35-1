## GLOBALS
{concat, zip-with, map, filter, flatten} = require 'prelude-ls'
Key = Mousetrap

const FPS = 30
const RES = 20
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

fill = (filler, length) ->
  return [filler] * length unless filler.slice
  for z from 0 til length
    filler.slice 0

flop = (a) ->
  # Transpose a 2d array
  width = a.length
  height = a.0.length
  grid = fill (fill 0, width), height
  for x from 0 til width
    for y from 0 til height
      grid[y][x] = a[x][y]
  return grid

clip = (a, x, y, w, h) ->
  grid = fill fill(0, height), width
  for ii from 0 til w
    for jj from 0 til h
      grid[ii][jj] = a[x+ii][y+jj]
  return grid

stamp = (src, dst, x, y, w, h) ->
  image = clip src, 0, 0, w, h
  for ii from 0 til image.length
    for jj from 0 til image.0.length
      dst[x+ii][y+jj] = image[ii][jj]
  return dst

grid-append = (a, b) ->
  # take two x/y grids and append them left to right
  zip-with ((x,y) -> x.concat y), a, b

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
    Point ~~@x, ~~@y

  grid: ~>
    Point ~~(@x/RES), ~~(@y/RES)

  to-grid: ~>
    gg = @grid!
    Point gg.x * RES, gg.y * RES

  eq: (oo) ~>
    oo.x == @x and oo.y == @y

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

  (@x, @y, @size=RES, drawable) ~>
    @@all.push this
    @tags = []
    @visible = true
    @ticks = []
    @add-tick @physics2D
    @graphics = drawable or Snuffle \#aaa, \#999, \#666

    @width = @height = @size
    @vx = 0; @vy = 0; @last-pos = Point 0, 0
    @last-dir = DIRS.0

  pos: ~> Point @x, @y

  physics2D: ->
    @x += @vx
    @y += @vy
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

  tagged: (tag) ~>
    -1 < @tags.index-of tag


class Shard extends Character
  @DIRS =
    0: {x: 0, y: -1, deg: 0}
    90: {x: 1, y: 0, deg: 90}
    180: {x: 0, y: 1, deg: 180}
    270: {x: -1, y: 0, deg: 270}

  @color = ->
    pick [\red \green \blue \purple \orange \white \cyan]

  (x, y, dir) ~>
    cc = @@color!
    super x, y, RES, (Snuffle cc, \white, cc)
    @rotation = dir
    @speed = 5
    @tags.push \shard
    @vx = @@DIRS[dir].x * @speed
    @vy = @@DIRS[dir].y * @speed
    @add-tick @explode-check
    @add-tick @wraparound
    @start-tick = window.game.frame
    @add-tick ~>
      if window.game.frame - @start-tick > 15
        window.game.world.fg.remove this
        @ticks = []
        @exit!

  wraparound: ~>
    switch
    | @x < 0 => @x = @speed + window.game.width - @width
    | @x + @width > window.game.width => @x = -@speed 
    | @y < 0 => @y = @speed + window.game.height - @height
    | @y + @height > window.game.height => @y = -@speed

  physics2D: ->
    @x += @vx
    @y += @vy

  explode-check: ~>
    return unless @pos!.eq @pos!.to-grid!
    pg = @pos!.grid!
    cell = window.game.world.bg.children.0.cells[pg.x]?[pg.y]
    if cell and cell.solid # time to blow up
      window.game.world.bg.children.0.cells[pg.x][pg.y] = empty-blok @x, @y
      explode @x, @y
      window.game.world.fg.remove this

class Critter extends Character
  @commands = 'fffbrrll..'
  @random-pattern = ->
    for x from 0 til 10
      pick @commands

  @DIRS =
    0: {x: 0, y: -1, deg: 0}
    90: {x: 1, y: 0, deg: 90}
    180: {x: 0, y: 1, deg: 180}
    270: {x: -1, y: 0, deg: 270}

  (...) ~>
    super ...
    @rotation = pick(@@DIRS).deg
    @index = 0
    @patterns =[
      @@random-pattern!
      @@random-pattern!
    ]
    @add-tick @wander
    @speed = 10
    @add-tick @rotation-tick
    @active-pattern = pick @patterns

  rotation-tick: ~> @rotation += ~~@va %% 360

  wander: ~>
    return unless window.game.frame % (FPS/2) == 0
    if @index > @active-pattern.length
      @index = 0
      @active-pattern = pick @patterns
    @move @active-pattern[@index]
    @index++

  orientation: (rotation = @rotation) ~>
    ind = ~~((rotation + 44) / 90) %% 4
    @@DIRS[ind*90]

  stop: ~> @vx = 0; @vy = 0; @va = 0

  move: (dir) ~>
    ori = @orientation!
    @stop!
    switch dir
    | \f => @vx = ori.x * @speed; @vy = ori.y * @speed
    | \b => @vx = -ori.x * @speed; @vy = -ori.y * @speed
    | \r => @va =  90 / (FPS/2)
    | \l => @va = -90 / (FPS/2)
    | otherwise => \nothing

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
    ctx.save!
    ctx.global-alpha = 0.9
    draw-semicircle @moon, pos, @size/2, ctx
    draw-triangle @wedge, pos, -@size/2, ctx, @size
    ctx.restore!

class Blok
  (@hour, @decade, @instant, @x=0, @y=0, @solid=false, @height=RES) ->
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

empty-blok = (x, y) ->
  new Blok \#ddd, \#ccc, \#ccc, x*RES, y*RES, false
solid-blok = (x, y) ->
  new Blok \black, \black, \white, x*RES, y*RES, true

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

    @cells = for x from 0 til @mapping.length
      for y from 0 til @mapping.0.length
        m = @mapping[x][y]
        blok = new Blok m.0, m.1, m.2, x*RES, y*RES
        blok.solid = m.3
        blok
    @walls = filter (.solid is true), flatten @cells

  draw: (ctx) ~>
    map (.draw ctx), flatten @cells

  update-walls: ~>
    @walls = filter (.solid is true), flatten @cells

class FlowerStack
  (size = RES*2) ~>
    @flowers = [
      (Flower.random size),
      (Flower.random ~~(size * 0.8)),
      (Flower.random ~~(size * 0.5))
    ]

  draw: (ctx, pos) ~>
    ctx.save!
    ctx.scale @scale, @scale if @scale
    map (.draw ctx, pos), @flowers
    ctx.restore!

  scale: (scale) ~>
    map (.scale = scale), @flowers

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
    ctx.scale @scale, @scale if @scale
    ctx.rotate deg-to-rad (window.game.frame % (360* 3))
    for p from 0 til @petals
      ctx.begin-path!
      ctx.bezier-curve-to @cp1.x, @cp1.y, @cp2.x, @cp2.y, @size, 0
      ctx.bezier-curve-to @cp2.x, -@cp2.y, @cp1.x, -@cp1.y, 0, 0
      ctx.close-path!
      ctx.fill!
      ctx.rotate deg-to-rad (360 / @petals)
    ctx.restore!

class Room
  @solid = [\black \black \white true]
  @empty = [\#ddd \#ccc null false]

  (width=20, height=15, game=null) ~>
    @mapping = fill fill(@@empty, width), height
    choices = ([@@empty] * (R(4) + 5)).concat [@@solid]
    for x from 0 til @mapping.length
      for y from 0 til @mapping.0.length
        @mapping[x][y] = pick choices
        game.wall-count++ if game and @mapping[x][y].3 == true

class Game
  (@width, @height, @fps) ->
    Math.seedrandom get-codeword!
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

    @loop-instance = set-interval @loop, 1000 / @fps

    Key.bind \z ~> #blow up
      wall-count = @wall-count
      pos = @player.center!.to-grid!
      cells = flatten @world.children.0.children.0.cells
      @player.visible = false
      explode pos.x, pos.y
      @player.add-tick ~> #check for end of game
        if Character.tagged \shard .length < 1
          @player.ticks = []
          current-wall-count = (filter (.solid), flatten @world.bg.children.0.cells).length
          if current-wall-count == 0
            alert "PERFECT! All #{wall-count} cells destroyed!"
          else
            alert "Destroyed #{wall-count - current-wall-count}/#{wall-count} walls!" +
                  "\nPush SPACE to try again!"
      Key.bind \z ->


    @player = new Character @width/2, @height/2, RES, (Snuffle \red, \black, \red)
    @player.speed = RES
    # bind movement
    for let dd in DIRS
      Key.bind dd.2, (~> it.prevent-default!; @player[dd.0] = 6 * dd.1; return false)
      Key.bind dd.2, (~> @player[dd.0] = 0), \keyup

    @wall-count = 0
    room = Room 30, 30, this
    @load-room room
    @world.fg.add @player

  load-room: (room) ~>
    @world.bg.set Map room.mapping
    @world.ground.clear!
    if @player.flower
      if room.base # we delivered it!
        console.log "Flower collected!"
        ff = @player.flower
        ff.ticks = []
        room.flowers.push ff
        ff.x = @width/4 + ((1+ff.origin.x) * (@width/(2*9))) - RES/2
        ff.y = @height/4 + ((1+ff.origin.y) * (@height/(2*9)))
        @player.flower = false
      else @world.ground.add @player.flower
    @world.ground.add room.shrine if room.shrine
    @world.ground.add room.flower if room.flower # flowers can be taken
    map @world.ground.add, room.flowers if room.flowers
    # TODO add critters etc.

  loop: ~>
    return if @pause
    @frame++
    for cc in Character.all
      cc?.tick!
    # Do camera translation
    @world.draw!

    if @over
      @world.draw-label 300 230 "GAME OVER"
      @world.draw-label 260 260 "push r to restart"

restart = ->
  it?.prevent-default!
  clear-interval window.game.loop-instance if window.game
  Character.empty-all!
  Key.reset!
  Key.bind \space, restart
  window.game = new Game 600, 600, FPS
  return false

get-codeword = ->
  if location.hash.length < 1
    location.hash = prompt "What are you trying to destroy?"
  return location.hash

explode = (x, y) ->
  for dir of Shard.DIRS
    window.game.world.fg.add new Shard x, y, dir

restart!

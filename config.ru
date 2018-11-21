require './app'

map "/" do
  run RDSLogin
end

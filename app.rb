# frozen_string_literal: true
# encoding: utf-8

require "sinatra/base"
require "cul/ldap"
require "slim"
require "csv"

class RDSLogin < Sinatra::Base

  get "/" do
    unless File.file? "log.csv"
      open("log.csv", "w") do |log|
        log << %w(time role dept faculty topic).to_csv
      end
    end
    slim :index
  end

  post "/" do
    begin
      open("log.csv", "a") do |log|
        log << [
          Time.now,
          params["role"],
          params["dept"],
          params["faculty"],
          params["topic"]
        ].to_csv
      end
      { message: "success" }.to_json
    rescue
      { message: "error" }.to_json
    end
  end

  post "/uni-search/:uni" do
    ldap = Cul::LDAP.new
    user = ldap.find_by_uni(params['uni'])
    results = { title: nil, dept: nil }
    unless user.nil? 
      results[:title] = user.title
      results[:dept] = user.ou
    end
    results.to_json
  end

  post "/prof-search/:name" do
    ldap = Cul::LDAP.new
    profs = ldap.search(base: "ou=People,o=Columbia University, c=US", filter: Net::LDAP::Filter.contains("cn", params[:name]) & Net::LDAP::Filter.contains("title", "Professor"))
    if profs.nil?
      { profs: nil }.to_json
    else
      { profs: profs.map{ |x| x.cn }.flatten }.to_json
    end
  end

end
